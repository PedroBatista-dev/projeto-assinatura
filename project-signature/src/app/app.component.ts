import { Component, ViewChild } from '@angular/core';
import { NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { DataService } from './data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('signature')
  public signaturePad!: SignaturePadComponent;

  public signaturePadOptions: NgSignaturePadOptions = { // passed through to szimek/signature_pad constructor
    minWidth: 5,
    canvasWidth: 700,
    canvasHeight: 300
  };

  formulario!: FormGroup;

  isFullScreen = false;

  options: { CodigoUsuario: number, Nome: string, NomeCracha: string, CaminhoAssinatura: string }[] = [];
  filteredOptions!: Observable<any[]>;

  constructor(private formBuilder: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      CodigoUsuario: [null],
      NomeCracha: [null],
      Assinatura: [null]
    });

    this.filteredOptions = this.formulario.controls['NomeCracha'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.dataService.getUsuarios().subscribe({
        next:  (response) => {
          this.options = response.data;
        },
        error: err => Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: `Erro ao buscar os usuarios: ${err}`
        })
    });
  }

  private _filter(value: any): any[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
  
      return this.options.filter(option => option.NomeCracha.toLowerCase().includes(filterValue));
    }

    const filterValue = value.NomeCracha.toLowerCase();

    this.formulario.get('NomeCracha')?.setValue(value.NomeCracha);
    this.formulario.get('CodigoUsuario')?.setValue(value.CodigoUsuario);
  
    return this.options.filter(option => option.NomeCracha.toLowerCase().includes(filterValue));
  }

  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  drawComplete(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onEnd event
    console.log('Completed drawing', event);
    console.log(this.signaturePad.toDataURL());
    this.formulario.get('Assinatura')?.setValue(this.signaturePad.toDataURL());
  }

  drawStart(event: MouseEvent | Touch) {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('Start drawing', event);
  }

  limpar() {
    this.signaturePad.clear();
  }

  enviar() {    
    if (this.formulario.get('CodigoUsuario')?.value && this.formulario.get('Assinatura')?.value) {
      this.dataService.enviarResposta(this.formulario.get('CodigoUsuario')?.value, this.formulario.get('Assinatura')?.value).subscribe({
        next:  (response) => {
          this.formulario.get('NomeCracha')?.setValue('');
          this.formulario.get('CodigoUsuario')?.setValue(null);
          this.formulario.get('Assinatura')?.setValue(null);
          this.limpar();
          this.dataService.getUsuarios().subscribe({
            next:  (response) => {
              this.options = response.data;
            },
            error: err => Swal.fire({
              icon: 'error',
              title: 'Erro!',
              text: `Erro ao buscar os usuarios: ${err}`
            })
          });
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Assinatura foi enviada com sucesso!',
            timer: 2000,
            showConfirmButton: false,
            width: 600,
            padding: '3em',
          });
        },
        error: err => Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: `Erro ao enviar a assinatura: ${err}`
        })
      });
    }
  }

  toggleFullScreen() {
    if (!this.isFullScreen) {
      this.openFullScreen();
    } else {
      this.closeFullScreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }

  openFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } 
  }

  closeFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } 
  }
}
