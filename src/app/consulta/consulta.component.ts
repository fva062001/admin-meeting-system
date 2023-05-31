import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as moment from 'moment';





@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  loading: boolean = false;
  lobby: boolean = true;
  login: boolean = false;
  registrar: boolean = false;
  reportForm: FormGroup;
  reportURL: string = environment.reportURL;
  id_Reunion: string = '';
  reunion = {
    tema: "",
    desde: "",
    hasta: "",
    fecha: "",
    lugar: "",
    correoElectronico: "",
    estatus: true
  }


  constructor(private fb: FormBuilder, private app: AppService, private activatedRoute: ActivatedRoute) {
    this.reportForm = this.fb.group({
      reunionId: ['', [Validators.required]]
    })
  }
  convertTimestamp(timestamp: any) {
    const dt = new Date(timestamp);
    const options = { hour: 'numeric', minute: '2-digit' };
    return dt.toLocaleTimeString('en-US');
  }



  generatePDF() {
    const data = {
      "codigoReunion": "6155f972c55e4c55a74de91a",
      "tema": "Tema 1",
      "correoElectronico": "email1@example.com",
      "desde": "2023-05-31T10:30:00.000Z",
      "hasta": "2023-05-31T12:30:00.000Z",
      "fecha": "2023-05-31T14:00:00.000Z",
      "lugar": "Location 1",
      "participantes": [
        {
          "nombreCompleto": "Participant 1",
          "cargo": "Manager",
          "institucion": "Company A",
          "correoElectronico": "participant1@example.com",
          "sexo": "Male",
          "telefono": "123456789",
          "tipoDocumento": "ID Card",
          "documento": "ABC123456",
          "fechaRegistro": "2023-05-31T08:00:00.000Z"
        },
        {
          "nombreCompleto": "Participant 2",
          "cargo": "Engineer",
          "institucion": "Company B",
          "correoElectronico": "participant2@example.com",
          "sexo": "Female",
          "telefono": "987654321",
          "tipoDocumento": "Passport",
          "documento": "XYZ987654",
          "fechaRegistro": "2023-05-30T15:30:00.000Z"
        },
        {
          "nombreCompleto": "Participant 3",
          "cargo": "Analyst",
          "institucion": "Company C",
          "correoElectronico": "participant3@example.com",
          "sexo": "Male",
          "telefono": "555555555",
          "tipoDocumento": "Driver's License",
          "documento": "DEF123456",
          "fechaRegistro": "2023-05-29T10:15:00.000Z"
        },
        {
          "nombreCompleto": "Participant 4",
          "cargo": "Designer",
          "institucion": "Company D",
          "correoElectronico": "participant4@example.com",
          "sexo": "Female",
          "telefono": "777777777",
          "tipoDocumento": "ID Card",
          "documento": "GHI987654",
          "fechaRegistro": "2023-05-28T14:45:00.000Z"
        },
        {
          "nombreCompleto": "Participant 5",
          "cargo": "Developer",
          "institucion": "Company E",
          "correoElectronico": "participant5@example.com",
          "sexo": "Male",
          "telefono": "999999999",
          "tipoDocumento": "Passport",
          "documento": "JKL123456",
          "fechaRegistro": "2023-05-27T09:30:00.000Z"
        }
      ],
      "estatus": true
    };

    const doc = new jsPDF('l', 'mm', [297, 210]);

    const title = [['Lista de participación']];

    const titleData = [[`Tema: ${data.tema}`], [`Fecha: ${moment(data.fecha).format("YYYY-MM-DD")}`], [`Lugar: ${data.lugar}`], [`Hora: ${this.convertTimestamp(data.desde)} - ${this.convertTimestamp(data.hasta)}`]]

    autoTable(doc, {
      head: title,
      body: titleData,
      theme: 'grid',
      headStyles: { fillColor: [82, 109, 130], halign: 'center' }
    })

    const header = [['#', 'Nombre', 'Cargo', 'Institución', 'Correo Electronico', 'Sexo', 'Telefono', 'Tipo Documento', 'Documento', 'Fecha Registro']];
    const reportData = data.participantes.map((e, index) => [index + 1, e.nombreCompleto, e.cargo, e.institucion, e.correoElectronico, e.sexo, e.telefono, e.tipoDocumento, e.documento, moment(e.fechaRegistro).format("YYYY-MM-DD")]);

    console.log(reportData)

    autoTable(doc, {
      head: header,
      body: reportData,
      headStyles: { fillColor: [82, 109, 130] }
      })

    doc.save('table.pdf');
  }



  // downloadFile(url: string, params: any) {
  //   fetch(
  //     url,
  //     { method: "post", body: JSON.stringify(params), headers: { "Content-Type": "application/json" } }
  //   )
  //     .then((res) => res.blob())
  //     .then((res) => {
  //       const aElement = document.createElement("a");
  //       const reportName = `listado_participación_${(Math.random() + 1).toString(36).substring(7)}.${params.reportFormat}`;
  //       console.log(reportName);
  //       aElement.setAttribute(
  //         "download",
  //         reportName
  //       );
  //       const href = URL.createObjectURL(res);
  //       aElement.href = href;
  //       aElement.setAttribute("target", "_blank");
  //       aElement.click();
  //       URL.revokeObjectURL(href);
  //     });
  // }

  // ngAfterViewInit(): void {
  //   const button = document.getElementById("btn");
  //   console.log(button)
  //   if (button !== null) {
  //     button.addEventListener('click', () => {
  //       const params = {
  //         "reportPath": "Reuniones",
  //         "reportName": "Listado_Reuniones",
  //         "reportFormat": "pdf",
  //         "params": {
  //           "reunionId": +this.id_Reunion
  //         }
  //       };
  //       this.downloadFile(this.reportURL, params);
  //     })
  //   }
  // }

  ngOnInit(): void {
    this.loading = true;
    this.activatedRoute.params.subscribe(params => {
      this.id_Reunion = params['id'];
      console.log(this.id_Reunion)
      this.app.getReunion(this.id_Reunion).subscribe(data => {
        console.log(data)
        this.reunion.tema = data.data.tema;
        this.reunion.fecha = data.data.fecha.slice(0, 10);
        this.reunion.hasta = data.data.hasta.slice(11, 16);
        this.reunion.desde = data.data.desde.slice(11, 16);
        this.loading = false;
      }, error => {
        this.loading = false;
      })
    })
  }




  getReport() {

  }


  get reunionId() {
    return this.reportForm.get('reunionId')
  }
}
