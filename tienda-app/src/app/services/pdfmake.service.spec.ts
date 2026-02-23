import { Injectable } from '@angular/core';
import { Producto } from './api';

import * as pdfMakeModule from 'pdfmake/build/pdfmake';
import * as pdfFontsModule from 'pdfmake/build/vfs_fonts';

const pdfMake: any = (pdfMakeModule as any).default || pdfMakeModule;
const pdfFonts: any = (pdfFontsModule as any).default || pdfFontsModule;
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

@Injectable({ providedIn: 'root' })
export class PdfService {

  constructor() { }

  generarFacturaProductos(productos: Producto[]) {
    const cuerpoTabla: any[] = [
      [ 
        { text: 'Producto', bold: true, fillColor: '#343a40', color: 'white' }, 
        { text: 'Categoría', bold: true, fillColor: '#343a40', color: 'white' }, 
        { text: 'Precio', bold: true, fillColor: '#343a40', color: 'white' } 
      ]
    ];

    let total = 0;
    productos.forEach(p => {
      cuerpoTabla.push([p.nombre, p.categoria?.nombre || '---', `$ ${p.precio.toFixed(2)}`]);
      total += p.precio;
    });

    cuerpoTabla.push([
      { text: 'TOTAL A PAGAR', colSpan: 2, alignment: 'right', bold: true }, '', 
      { text: `$ ${total.toFixed(2)}`, bold: true, color: 'red' }
    ]);

    const definicionPDF: any = {
      content: [
        { text: 'INFIEC Cía. Ltda.', style: 'header' },
        { text: 'Factura Comercial', style: 'subheader' },
        { text: 'Fecha de emisión: ' + new Date().toLocaleDateString(), margin: [0, 0, 0, 20] },
        {
          table: { headerRows: 1, widths: ['*', 'auto', 100], body: cuerpoTabla },
          layout: 'lightHorizontalLines'
        },
        { text: '¡Gracias por su confianza!', alignment: 'center', margin: [0, 30, 0, 0], italics: true }
      ],
      styles: {
        header: { fontSize: 24, bold: true, color: '#0d6efd', margin: [0, 0, 0, 5] },
        subheader: { fontSize: 14, bold: true, margin: [0, 0, 0, 5] }
      }
    };

    pdfMake.createPdf(definicionPDF).download('Factura_INFIEC.pdf');
  }
}