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

    let subtotal = 0;
    productos.forEach(p => subtotal += p.precio);
    
    let iva = subtotal * 0.15;
    let total = subtotal + iva;


    const cuerpoTabla: any[] = [
      [ 
        { text: 'Cant.', bold: true, fillColor: '#0d6efd', color: 'white', alignment: 'center' }, 
        { text: 'Descripción', bold: true, fillColor: '#0d6efd', color: 'white' }, 
        { text: 'Categoría', bold: true, fillColor: '#0d6efd', color: 'white' }, 
        { text: 'P. Unitario', bold: true, fillColor: '#0d6efd', color: 'white', alignment: 'right' },
        { text: 'Total', bold: true, fillColor: '#0d6efd', color: 'white', alignment: 'right' } 
      ]
    ];

    productos.forEach(p => {
      cuerpoTabla.push([
        { text: '1', alignment: 'center' },
        p.nombre, 
        p.categoria?.nombre || '---', 
        { text: `$${p.precio.toFixed(2)}`, alignment: 'right' },
        { text: `$${p.precio.toFixed(2)}`, alignment: 'right' }
      ]);
    });


    const definicionPDF: any = {
      content: [
        // --- CABECERA DE LA FACTURA ---
        {
          columns: [
            {
              // Datos de la Empresa
              width: '60%',
              text: [
                { text: 'INFIEC Cía. Ltda.\n', style: 'tituloEmpresa' },
                { text: 'RUC: ', bold: true }, '0999999999001\n',
                { text: 'Dirección: ', bold: true }, 'Av. Principal y Secundaria\n',
                { text: 'Teléfono: ', bold: true }, '0999999999\n',
                { text: 'Correo: ', bold: true }, 'ventas@infiec.com\n'
              ]
            },
            {
              // Datos del Documento y Cliente
              width: '40%',
              text: [
                { text: 'FACTURA\n', style: 'tituloFactura' },
                { text: 'N° 001-001-000000123\n\n', color: '#dc3545', bold: true, fontSize: 12 },
                { text: 'Fecha: ', bold: true }, new Date().toLocaleDateString() + '\n',
                { text: 'Cliente: ', bold: true }, 'Consumidor Final\n',
                { text: 'RUC/CI: ', bold: true }, '9999999999\n'
              ],
              alignment: 'right'
            }
          ],
          margin: [0, 0, 0, 20]
        },

        // --- TABLA DE PRODUCTOS ---
        {
          table: { 
            headerRows: 1, 
            widths: ['auto', '*', 'auto', 80, 80], 
            body: cuerpoTabla 
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 15]
        },

        // --- DESGLOSE DE TOTALES ---
        {
          columns: [
            { width: '*', text: '' },
            {
              width: 200,
              table: {
                widths: ['*', 80],
                body: [
                  [ { text: 'SUBTOTAL 15%', bold: true, alignment: 'right' }, { text: `$${subtotal.toFixed(2)}`, alignment: 'right' } ],
                  [ { text: 'SUBTOTAL 0%', bold: true, alignment: 'right' }, { text: '$0.00', alignment: 'right' } ],
                  [ { text: 'IVA 15%', bold: true, alignment: 'right' }, { text: `$${iva.toFixed(2)}`, alignment: 'right' } ],
                  [ { text: 'TOTAL A PAGAR', bold: true, alignment: 'right', fillColor: '#f8f9fa' }, { text: `$${total.toFixed(2)}`, bold: true, color: 'red', alignment: 'right', fillColor: '#f8f9fa' } ]
                ]
              },
              layout: 'noBorders'
            }
          ]
        },

        // --- MENSAJE FINAL ---
        { text: '¡Gracias por su compra!', alignment: 'center', margin: [0, 40, 0, 0], italics: true, color: 'gray' }
      ],

      // --- ESTILOS DE LETRA ---
      styles: {
        tituloEmpresa: { fontSize: 22, bold: true, color: '#0d6efd', margin: [0, 0, 0, 5] },
        tituloFactura: { fontSize: 18, bold: true, margin: [0, 0, 0, 2] }
      }
    };

    // Generamos y descargamos el PDF
    pdfMake.createPdf(definicionPDF).download('Factura_INFIEC.pdf');
  }
}