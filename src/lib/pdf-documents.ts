import jsPDF from "jspdf";

type PdfRestaurant = {
  name: string;
  city: string;
  gstin: string;
  address?: string;
  phone?: string;
  email?: string;
};

type PdfLine = {
  name: string;
  qty: number;
  unitPrice: number;
  amount: number;
};

type InvoicePdf = {
  restaurant: PdfRestaurant;
  invoiceNumber: string;
  date: string;
  customer: string;
  phone?: string;
  channel: string;
  table?: string;
  payment: string;
  lines: PdfLine[];
  subtotal: number;
  discount: number;
  tax: number;
  delivery?: number;
  total: number;
};

type ReceiptPdf = Omit<InvoicePdf, "invoiceNumber" | "date" | "phone" | "channel" | "table"> & {
  receiptNumber: string;
  date: string;
  channel: string;
  table?: string;
  cgst: number;
};

export type QrLabelTheme = {
  bg: string;
  fg: string;
  accent: string;
};

const money = (amount: number) => `Rs. ${amount.toLocaleString("en-IN")}`;
const safeName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function line(doc: jsPDF, x: number, y: number, width: number, color = "#d8d8d8") {
  doc.setDrawColor(color);
  doc.line(x, y, x + width, y);
}

function addInvoicePage(doc: jsPDF, invoice: InvoicePdf) {
  const left = 18;
  const width = 174;
  let y = 20;

  doc.setFillColor("#15140f");
  doc.rect(left, y, width, 25, "F");
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(invoice.restaurant.name, left + 6, y + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(invoice.restaurant.city, left + 6, y + 17);
  doc.text(`GSTIN ${invoice.restaurant.gstin}`, left + 6, y + 22);

  doc.setTextColor("#15140f");
  y += 37;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("TAX INVOICE", left, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Invoice: ${invoice.invoiceNumber}`, left, y + 7);
  doc.text(`Date: ${invoice.date}`, left, y + 12);

  const rightX = 112;
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", rightX, y);
  doc.setFont("helvetica", "normal");
  doc.text(doc.splitTextToSize(invoice.customer, 78), rightX, y + 6);
  if (invoice.phone) doc.text(`Phone: ${invoice.phone}`, rightX, y + 12);
  doc.text(`Order type: ${invoice.channel}${invoice.table ? ` · Table ${invoice.table}` : ""}`, rightX, y + 18);

  y += 31;
  line(doc, left, y, width, "#15140f");
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("ITEM", left, y);
  doc.text("QTY", 135, y, { align: "right" });
  doc.text("RATE", 161, y, { align: "right" });
  doc.text("AMOUNT", left + width, y, { align: "right" });
  y += 4;
  line(doc, left, y, width);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  for (const item of invoice.lines) {
    const itemLines = doc.splitTextToSize(item.name, 83);
    doc.text(itemLines, left, y);
    doc.text(String(item.qty), 135, y, { align: "right" });
    doc.text(money(item.unitPrice), 161, y, { align: "right" });
    doc.text(money(item.amount), left + width, y, { align: "right" });
    y += Math.max(6, itemLines.length * 4.5) + 2;
  }

  y += 2;
  line(doc, left, y, width);
  y += 8;
  const summary = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, 121, y);
    doc.text(value, left + width, y, { align: "right" });
    y += 6;
  };
  summary("Subtotal", money(invoice.subtotal));
  if (invoice.discount > 0) summary("Discount", `- ${money(invoice.discount)}`);
  summary("CGST + SGST", money(invoice.tax));
  if (invoice.delivery) summary("Delivery", money(invoice.delivery));
  y += 1;
  line(doc, 112, y, 80, "#15140f");
  y += 8;
  summary("TOTAL", money(invoice.total), true);

  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`Payment: ${invoice.payment}`, left, y);
  y += 13;
  line(doc, left, y, width);
  doc.setFontSize(8);
  doc.setTextColor("#5c574c");
  doc.text("Thank you for dining with us.", 105, y + 7, { align: "center" });
  if (invoice.restaurant.address) {
    doc.text(doc.splitTextToSize(invoice.restaurant.address, width), 105, y + 12, { align: "center" });
  }
}

export function downloadInvoicePdf(invoice: InvoicePdf) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  addInvoicePage(doc, invoice);
  doc.save(`${safeName(invoice.invoiceNumber)}.pdf`);
}

export function downloadReceiptPdf(receipt: ReceiptPdf) {
  const height = Math.max(105, 76 + receipt.lines.length * 9);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, height] });
  const left = 5;
  const right = 75;
  let y = 9;
  doc.setTextColor("#15140f");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(receipt.restaurant.name, 40, y, { align: "center" });
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(receipt.restaurant.city, 40, y, { align: "center" });
  y += 4;
  doc.text(`GSTIN ${receipt.restaurant.gstin}`, 40, y, { align: "center" });
  y += 5;
  line(doc, left, y, right - left, "#777777");
  y += 5;
  doc.text(`${receipt.receiptNumber}  ${receipt.date}`, left, y);
  y += 4;
  doc.text(`${receipt.channel}${receipt.table ? ` · Table ${receipt.table}` : ""}`, left, y);
  y += 4;
  doc.text(`Guest: ${receipt.customer}`, left, y);
  y += 5;
  line(doc, left, y, right - left, "#777777");
  y += 5;

  for (const item of receipt.lines) {
    const nameLines = doc.splitTextToSize(`${item.qty} x ${item.name}`, 48);
    doc.text(nameLines, left, y);
    doc.text(money(item.amount), right, y, { align: "right" });
    y += Math.max(4, nameLines.length * 4) + 2;
  }

  line(doc, left, y, right - left, "#777777");
  y += 5;
  const summary = (label: string, amount: number) => {
    doc.text(label, left, y);
    doc.text(money(amount), right, y, { align: "right" });
    y += 4.5;
  };
  summary("Subtotal", receipt.subtotal);
  if (receipt.discount > 0) summary("Discount", -receipt.discount);
  summary("CGST", receipt.cgst);
  summary("SGST", receipt.cgst);
  if (receipt.delivery) summary("Delivery", receipt.delivery);
  y += 1;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("TOTAL", left, y);
  doc.text(money(receipt.total), right, y, { align: "right" });
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Paid via ${receipt.payment}`, 40, y, { align: "center" });
  y += 5;
  doc.text("Thank you for dining with us.", 40, y, { align: "center" });
  doc.save(`${safeName(receipt.receiptNumber)}.pdf`);
}

export async function svgToPngDataUrl(svg: SVGSVGElement, size = 640): Promise<string> {
  const copy = svg.cloneNode(true) as SVGSVGElement;
  copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  copy.setAttribute("width", String(size));
  copy.setAttribute("height", String(size));
  copy.style.width = `${size}px`;
  copy.style.height = `${size}px`;
  const source = new XMLSerializer().serializeToString(copy);
  const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));

  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not prepare the QR image for PDF export.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size, size);
    context.drawImage(image, 0, 0, size, size);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawQrCard(doc: jsPDF, label: string, png: string, theme: QrLabelTheme, x: number, y: number) {
  doc.setFillColor(theme.bg);
  doc.roundedRect(x, y, 60, 90, 2, 2, "F");
  doc.setTextColor(theme.fg);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("NEELA", x + 5, y + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("TABLE", x + 55, y + 9, { align: "right" });
  doc.setTextColor(theme.accent);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(31);
  doc.text(label, x + 5, y + 31);
  doc.setFillColor("#ffffff");
  doc.roundedRect(x + 10, y + 36, 40, 40, 1, 1, "F");
  doc.addImage(png, "PNG", x + 12, y + 38, 36, 36);
  doc.setTextColor(theme.fg);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("SCAN  ·  ORDER  ·  PAY", x + 30, y + 84, { align: "center" });
}

export function downloadQrLabelPdf(label: string, png: string, theme: QrLabelTheme) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [60, 90] });
  drawQrCard(doc, label, png, theme, 0, 0);
  doc.save(`table-${label}-qr-label.pdf`);
}

export function downloadAllQrLabelsPdf(labels: { label: string; png: string }[], theme: QrLabelTheme) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  labels.forEach(({ label, png }, index) => {
    if (index > 0 && index % 6 === 0) doc.addPage("a4", "portrait");
    const position = index % 6;
    const x = position % 2 === 0 ? 30 : 120;
    const y = 13.5 + Math.floor(position / 2) * 90;
    drawQrCard(doc, label, png, theme, x, y);
  });
  doc.save("all-table-qr-labels.pdf");
}
