import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const generatePDF = async () => {
    const element = document.getElementById("graph-section");
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth * 0.9; // залишаємо невеликий відступ
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
    pdf.save("споживання.pdf");
};

export default generatePDF;