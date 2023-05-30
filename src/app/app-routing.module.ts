import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './lobby/lobby.component';
import { ConsultaComponent } from './consulta/consulta.component';


const routes: Routes = [
  { path: 'reporte/:id', component: ConsultaComponent },
  { path: 'registrar', component: LobbyComponent },
  { path: '**', redirectTo: 'registrar', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
