import jsPDF from "jspdf";
import { Order } from "@/types/order";

export function generateExactLayoutPDF(order: Order) {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  const totalWidth = 185;
  const leftX = 10;

  function drawYellowHeader(x: number, y: number, w: number, h: number, text: string) {
    doc.setFillColor("#FFFF00");
    doc.setDrawColor("#000000");
    doc.setLineWidth(0.4);
    doc.rect(x, y, w, h, "FD");
    const cx = x + w / 2;
    const cy = y + h / 2 + 1.2;
    doc.setFont("helvetica", "bold");
    doc.text(text, cx, cy, { align: "center" });
    doc.setFont("helvetica", "normal");
  }

  function drawViaLabel(startY: number, text: string) {
    const h = 5;
    drawYellowHeader(leftX, startY, totalWidth, h, text);
    return startY + h;
  }

  function drawHeaderBox(startY: number, osNumber?: string) {
    const headerHeight = 5;
    const w1 = totalWidth * 0.8;
    const w2 = totalWidth * 0.2;
    drawYellowHeader(leftX, startY, w1, headerHeight, "ÓTICA ROYAL");
    drawYellowHeader(leftX + w1, startY, w2, headerHeight, `O.S. Nº ${osNumber || ""}`);
    return startY + headerHeight;
  }

  function drawMainInfoTable(startY: number, isFullInfo: boolean) {
    const lines = isFullInfo ? 6 : 2;
    const rowHeight = 4.5;
    const height = lines * rowHeight;
    doc.setDrawColor("#000000");
    doc.setLineWidth(0.4);
    doc.rect(leftX, startY, totalWidth, height, "S");
    for (let i = 1; i < lines; i++) {
      doc.line(leftX, startY + rowHeight * i, leftX + totalWidth, startY + rowHeight * i);
    }
    const colW = totalWidth / 4;
    for (let c = 1; c < 4; c++) {
      let xPos = leftX + colW * c;
      if (c === 1) xPos -= 15;
      doc.line(xPos, startY, xPos, startY + height);
    }
    const line1Y = startY + 3;

    const centerText = (text: string, colStart: number, colEnd: number, y: number) => {
      const textWidth = doc.getTextWidth(text);
      const centerX = colStart + (colEnd - colStart - textWidth) / 2;
      doc.text(text, centerX, y);
    };

    doc.setFont("helvetica", "bold");
    doc.text("CLIENTE", leftX + 2, line1Y);
    doc.setFont("helvetica", "normal");
    doc.text(order.client || "", leftX + 50, line1Y);
    doc.setFont("helvetica", "bold");
    doc.text("EXAMINADOR", leftX + colW * 2 + 2, line1Y);
    doc.setFont("helvetica", "normal");
    doc.text(order.examiner || "", leftX + colW * 2 + 58, line1Y);
    if (lines >= 2) {
      const line2Y = startY + rowHeight + 3;
      doc.setFont("helvetica", "bold");
      doc.text("ENDEREÇO", leftX + 2, line2Y);
      doc.setFont("helvetica", "normal");
      doc.text(order.clientAddress || "", leftX + 35, line2Y);
      doc.setFont("helvetica", "bold");
      doc.text("TELEFONE", leftX + colW * 2 + 2, line2Y);
      doc.setFont("helvetica", "normal");
      doc.text(order.clientPhone || "", leftX + colW * 2 + 58, line2Y);
    }
    if (lines >= 3) {
      const line3Y = startY + rowHeight * 2 + 3;
      doc.setFont("helvetica", "bold");
      doc.text("DATA DA VENDA", leftX + 2, line3Y);
      doc.setFont("helvetica", "normal");
      doc.text(order.date || "", leftX + 50, line3Y);
      doc.setFont("helvetica", "bold");
      doc.text("DATA DE NASC.", leftX + colW * 2 + 2, line3Y);
      doc.setFont("helvetica", "normal");
      doc.text(order.clientBirthDate || "", leftX + colW * 2 + 58, line3Y);
    }
    if (lines >= 4) {
      const line4Y = startY + rowHeight * 3 + 3;
      doc.setFont("helvetica", "bold");
      doc.text("ENTREGA PREVISTA", leftX + 2, line4Y);
      doc.setFont("helvetica", "normal");
      doc.text(order.deliveryDate || "", leftX + 50, line4Y);
      doc.setFont("helvetica", "bold");
      doc.text("VALOR DA VENDA", leftX + colW * 2 + 2, line4Y);
      doc.setFont("helvetica", "normal");
      doc.text(`${order.totalValue || "0,00"}`, leftX + colW * 2 + 58, line4Y);
    }
    if (lines >= 5) {
      const line5Y = startY + rowHeight * 4 + 3;
      doc.setFont("helvetica", "bold");
      doc.text("ENTREGUE EM", leftX + 2, line5Y);
      doc.setFont("helvetica", "normal");
      doc.text("-", leftX + 18, line5Y);
      doc.setFont("helvetica", "bold");
      doc.text("VALOR PAGO", leftX + colW * 2 + 2, line5Y);
      doc.setFont("helvetica", "normal");
      doc.text(`${order.amountPaid || "0,00"}`, leftX + colW * 2 + 58, line5Y);
    }
    if (lines >= 6) {
      const line6Y = startY + rowHeight * 5 + 3;
      doc.setFont("helvetica", "bold");
      doc.text("OBSERVAÇÃO", leftX + 2, line6Y);
      doc.setFont("helvetica", "normal");
      doc.text(order.observations || "", leftX + 50, line6Y);
      doc.setFont("helvetica", "bold");
      doc.text("VENDEDOR", leftX + colW * 2 + 2, line6Y);
      doc.setFont("helvetica", "normal");
      doc.text(order.seller || "", leftX + colW * 2 + 58, line6Y);
    }
    return startY + height;
  }

  function drawLensTable(startY: number) {
    const rows = 5;
    const rowH = 4;
    const height = rows * rowH;
    doc.setDrawColor("#000000");
    doc.setLineWidth(0.4);
    doc.rect(leftX, startY, totalWidth, height, "S");
    for (let r = 1; r < rows; r++) {
      doc.line(leftX, startY + rowH * r, leftX + totalWidth, startY + rowH * r);
    }
    const colCount = 6;
    const colW = totalWidth / colCount;
    for (let c = 1; c < colCount; c++) {
      doc.line(leftX + colW * c, startY, leftX + colW * c, startY + height);
    }
    doc.setFont("helvetica", "bold");
    doc.text("", leftX + 2, startY + 3);
    doc.text("ESF.", leftX + colW + 2, startY + 3);
    doc.text("CIL.", leftX + colW * 2 + 2, startY + 3);
    doc.text("EIXO", leftX + colW * 3 + 2, startY + 3);
    doc.text("PRISMA", leftX + colW * 4 + 2, startY + 3);
    doc.text("DNP", leftX + colW * 5 + 2, startY + 3);
    doc.setFont("helvetica", "normal");
    const line1Y = startY + rowH + 3;
    doc.text("LONGE OD", leftX + 2, line1Y);
    doc.text(order.lensDetails?.longeOdSpherical || "", leftX + colW + 2, line1Y);
    doc.text(order.lensDetails?.longeOdCylindrical || "", leftX + colW * 2 + 2, line1Y);
    doc.text(order.lensDetails?.longeOdAxis || "", leftX + colW * 3 + 2, line1Y);
    doc.text(order.lensDetails?.longeOdPrism || "-", leftX + colW * 4 + 2, line1Y);
    doc.text(order.lensDetails?.longeOdDnp || "", leftX + colW * 5 + 2, line1Y);
    const line2Y = line1Y + rowH;
    doc.text("LONGE OE", leftX + 2, line2Y);
    doc.text(order.lensDetails?.longeOeSpherical || "", leftX + colW + 2, line2Y);
    doc.text(order.lensDetails?.longeOeCylindrical || "", leftX + colW * 2 + 2, line2Y);
    doc.text(order.lensDetails?.longeOeAxis || "", leftX + colW * 3 + 2, line2Y);
    doc.text(order.lensDetails?.longeOePrism || "-", leftX + colW * 4 + 2, line2Y);
    doc.text(order.lensDetails?.longeOeDnp || "", leftX + colW * 5 + 2, line2Y);
    const line3Y = line2Y + rowH;
    doc.text("PERTO OD", leftX + 2, line3Y);
    doc.text(order.lensDetails?.pertoOdSpherical || "", leftX + colW + 2, line3Y);
    doc.text(order.lensDetails?.pertoOdCylindrical || "", leftX + colW * 2 + 2, line3Y);
    doc.text(order.lensDetails?.pertoOdAxis || "", leftX + colW * 3 + 2, line3Y);
    doc.text(order.lensDetails?.pertoOdPrism || "-", leftX + colW * 4 + 2, line3Y);
    doc.text(order.lensDetails?.pertoOdDnp || "", leftX + colW * 5 + 2, line3Y);
    const line4Y = line3Y + rowH;
    doc.text("PERTO OE", leftX + 2, line4Y);
    doc.text(order.lensDetails?.pertoOeSpherical || "", leftX + colW + 2, line4Y);
    doc.text(order.lensDetails?.pertoOeCylindrical || "", leftX + colW * 2 + 2, line4Y);
    doc.text(order.lensDetails?.pertoOeAxis || "", leftX + colW * 3 + 2, line4Y);
    doc.text(order.lensDetails?.pertoOePrism || "-", leftX + colW * 4 + 2, line4Y);
    doc.text(order.lensDetails?.pertoOeDnp || "", leftX + colW * 5 + 2, line4Y);
    return startY + height;
  }

  function drawDpAddAlturaTable(startY: number) {
    const height = 12;
    doc.setDrawColor("#000000");
    doc.setLineWidth(0.4);
    doc.rect(leftX, startY, totalWidth, height, "S");
    doc.line(leftX, startY + 4, leftX + totalWidth, startY + 4);
    const colCount = 3;
    const colW = totalWidth / colCount;
    for (let c = 1; c < colCount; c++) {
      doc.line(leftX + colW * c, startY, leftX + colW * c, startY + height);
    }
    doc.setFont("helvetica", "bold");
    doc.text("ADD", leftX + 2, startY + 2.8);
    doc.text("DP", leftX + colW + 2, startY + 2.8);
    doc.text("ALTURA", leftX + colW * 2 + 2, startY + 2.8);
    doc.setFont("helvetica", "normal");
    const dataY = startY + 4 + 2.8;
    doc.text(order.lensDetails?.addition || "", leftX + 2, dataY);
    doc.text(order.lensDetails?.dp || "", leftX + colW + 2, dataY);
    doc.text(order.lensDetails?.height || "", leftX + colW * 2 + 2, dataY);
    return startY + height;
  }

  function drawFrameTable(startY: number) {
    const height = 10;
    doc.setDrawColor("#000000");
    doc.setLineWidth(0.4);
    doc.rect(leftX, startY, totalWidth, height, "S");
    doc.line(leftX, startY + 4, leftX + totalWidth, startY + 4);
    const colCount = 4;
    const colW = totalWidth / colCount;
    for (let c = 1; c < colCount; c++) {
      doc.line(leftX + colW * c, startY, leftX + colW * c, startY + height);
    }
    doc.setFont("helvetica", "bold");
    doc.text("ARMAÇÃO", leftX + 2, startY + 2.8);
    doc.text("COR", leftX + colW + 2, startY + 2.8);
    doc.text("LENTE", leftX + colW * 2 + 2, startY + 2.8);
    doc.text("TIPO", leftX + colW * 3 + 2, startY + 2.8);
    doc.setFont("helvetica", "normal");
    const dataY = startY + 4 + 2.8;
    doc.text(order.lensDetails?.frameDescription || "", leftX + 2, dataY);
    doc.text(order.lensDetails?.frameColor || "", leftX + colW + 2, dataY);
    doc.text(order.lensDetails?.lensType || "", leftX + colW * 2 + 2, dataY);
    doc.text(order.lensDetails?.lensCategory || "", leftX + colW * 3 + 2, dataY);
    return startY + height;
  }

  function drawCompanyHeader(startY: number) {
    doc.setFont("helvetica", "bold");
    doc.text("ÓTICA ROYAL", leftX, startY);
    startY += 4;
    doc.setFont("helvetica", "normal");
    doc.text("@use.royall", leftX, startY);
    startY += 4;
    doc.text("Tel.: (81) 9.9854-5035 | sac.oticaroyal@gmail.com", leftX, startY);
    return startY + 3;
  }

  function drawFullBlock(startY: number, viaTitle: string, isFullInfo: boolean, isLab?: boolean) {
    let currentY = drawCompanyHeader(startY);
    currentY = drawViaLabel(currentY, viaTitle);
    currentY = drawHeaderBox(currentY + 2, order.orderNumber);
    if (!isLab) {
      currentY = drawMainInfoTable(currentY + 2, isFullInfo);
    }
    currentY = drawLensTable(currentY + 3);
    currentY = drawDpAddAlturaTable(currentY);
    currentY = drawFrameTable(currentY + 5);
    return currentY + 2;
  }

  let currentY = 10;
  currentY = drawFullBlock(currentY, "VIA DA ÓTICA", true, false);
  currentY = drawFullBlock(currentY + 2, "VIA DO LABORATÓRIO", false, true);
  currentY = drawFullBlock(currentY + 2, "VIA DO CLIENTE", true, false);
  doc.save(`OS_${order.orderNumber}.pdf`);
}
