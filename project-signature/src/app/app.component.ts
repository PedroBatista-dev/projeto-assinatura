import { Component, ViewChild } from '@angular/core';
import { NgSignaturePadOptions, SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      CodigoUsuario: [null],
      Assinatura: [null]
    });
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
    console.log(this.formulario.value);
    if (this.formulario.get('resposta')?.value) {
      // this.dataService.enviarResposta(this.formulario.get('resposta')?.value.trim()).subscribe({
      //   next:  (response) => {
      //     this.formulario.get('resposta')!.reset();
      //     Swal.fire({
      //       icon: 'success',
      //       title: 'Sucesso!',
      //       text: 'Sua resposta foi enviada com sucesso!',
      //       timer: 2000,
      //       showConfirmButton: false,
      //       width: 600,
      //       padding: '3em',
      //     });
      //   },
      //   error: err => Swal.fire({
      //     icon: 'error',
      //     title: 'Erro!',
      //     text: `Erro ao enviar a resposta: ${err}`
      //   })
      // });
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
