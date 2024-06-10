// lista-usuarios.component.ts
import { Component, OnInit } from '@angular/core';
import { RestnodeService } from '../../../servicios/restnode.service';
import { ICliente } from '../../../models/cliente';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-usuarios',
  standalone: true,
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css'],
  imports: [FormsModule, ReactiveFormsModule],
})
export class ListaUsuariosComponent implements OnInit {

  usuarios: Array<ICliente> = [];
  usuarioSeleccionado: ICliente | null = null;
  formUsuario: FormGroup;

  constructor(private restSvc: RestnodeService) {
    this.formUsuario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      apellidos: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      telefono: new FormControl(''),
      pais: new FormControl('', Validators.required),
      rol: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.restSvc.RecuperarUsuarios().then(data => {
      console.log('Usuarios recuperados:', data);
      this.usuarios = data.otrosdatos as Array<ICliente>;
    }).catch(error => {
      console.error('Error al recuperar usuarios:', error);
    });
  }

  editUser(usuario: ICliente){
    console.log('Editar usuario...', usuario);
    this.usuarioSeleccionado = usuario;
    this.formUsuario.setValue({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.cuenta.email,
      login: usuario.cuenta.login,
      password: usuario.cuenta.password,
      telefono: usuario.telefono || '',
      pais: usuario.pais,
      rol: usuario.datosLol.rol
    });
  }

  deleteUser(userId: string){
    console.log('Eliminar usuario:', userId);
    this.restSvc.EliminarUsuario(userId).then(data => {
      console.log('Usuario eliminado:', data);
      this.usuarios = this.usuarios.filter(u => u._id !== userId);
    }).catch(error => {
      console.error('Error al eliminar usuario:', error);
    });
  }

  onSubmit() {
    if (this.formUsuario.valid && this.usuarioSeleccionado) {
      const updatedUser = { ...this.usuarioSeleccionado, ...this.formUsuario.value };
      console.log('Actualizar usuario...', updatedUser);
      this.restSvc.EditarUsuario(updatedUser).then(data => {
        console.log('Usuario actualizado:', data);
        this.usuarios = this.usuarios.map(u => u._id === updatedUser._id ? updatedUser : u);
      }).catch(error => {
        console.error('Error al actualizar usuario:', error);
      });
    }
  }
}
