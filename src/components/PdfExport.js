'use client';

import jsPDF from 'jspdf';

const CATEGORY_MAP = {
    dream: { emoji: '🌟', label: 'Rêve' },
    desire: { emoji: '✈️', label: 'Envie' },
    curiosity: { emoji: '🔍', label: 'Curiosité' },
};

const STATUS_MAP = {
    todo: { emoji: '📌', label: 'À faire' },
    in_progress: { emoji: '🚀', label: 'En cours' },
    done: { emoji: '✅', label: 'Fait' },
};

const CATEGORY_COLORS = {
    dream: [245, 158, 11],
    desire: [59, 130, 246],
    curiosity: [148, 163, 184],
};

const STATUS_COLORS = {
    todo: [245, 158, 11],
    in_progress: [99, 102, 241],
    done: [34, 197, 94],
};

export function exportToPdf(destinations) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Cover page
    doc.setFillColor(15, 17, 23);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(255, 255, 255);
    doc.text('My Travel List', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(150, 150, 170);
    doc.text('Mon carnet de voyages', pageWidth / 2, pageHeight / 2 + 5, { align: 'center' });

    doc.setFontSize(11);
    doc.text(`${destinations.length} destinations`, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });

    const dreamCount = destinations.filter(d => d.category === 'dream').length;
    const desireCount = destinations.filter(d => d.category === 'desire').length;
    const curiosityCount = destinations.filter(d => d.category === 'curiosity').length;
    const doneCount = destinations.filter(d => d.status === 'done').length;

    doc.setFontSize(10);
    doc.setTextColor(120, 120, 140);
    doc.text(
        `${dreamCount} reves  •  ${desireCount} envies  •  ${curiosityCount} curiosites  •  ${doneCount} faits`,
        pageWidth / 2,
        pageHeight / 2 + 32,
        { align: 'center' }
    );

    const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 120);
    doc.text(`Genere le ${today}`, pageWidth / 2, pageHeight - 30, { align: 'center' });

    // Destination pages
    let y = 0;

    destinations.forEach((dest, index) => {
        if (index % 3 === 0) {
            doc.addPage();
            y = margin;

            // Page header
            doc.setFillColor(248, 250, 252);
            doc.rect(0, 0, pageWidth, 12, 'F');
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 170);
            doc.text('My Travel List', margin, 8);
            doc.text(`Page ${Math.ceil((index + 1) / 3)}`, pageWidth - margin, 8, { align: 'right' });
            y = 20;
        }

        const cardHeight = 75;
        const cat = CATEGORY_MAP[dest.category] || CATEGORY_MAP.curiosity;
        const status = STATUS_MAP[dest.status] || STATUS_MAP.todo;
        const catColor = CATEGORY_COLORS[dest.category] || CATEGORY_COLORS.curiosity;
        const stColor = STATUS_COLORS[dest.status] || STATUS_COLORS.todo;

        // Card background
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(229, 231, 235);
        doc.roundedRect(margin, y, contentWidth, cardHeight, 3, 3, 'FD');

        // Color accent bar
        doc.setFillColor(...catColor);
        doc.rect(margin, y, 3, cardHeight, 'F');

        // Destination name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(26, 26, 46);
        doc.text(dest.name, margin + 10, y + 14);

        // Category badge
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setFillColor(...catColor, 30);
        const catText = `${cat.label}`;
        const catWidth = doc.getTextWidth(catText) + 8;
        doc.setFillColor(catColor[0], catColor[1], catColor[2]);
        doc.setTextColor(255, 255, 255);
        doc.roundedRect(margin + 10, y + 19, catWidth, 7, 2, 2, 'F');
        doc.text(catText, margin + 14, y + 24);

        // Status badge
        const stText = `${status.label}`;
        const stWidth = doc.getTextWidth(stText) + 8;
        doc.setFillColor(stColor[0], stColor[1], stColor[2]);
        doc.roundedRect(margin + 10 + catWidth + 4, y + 19, stWidth, 7, 2, 2, 'F');
        doc.text(stText, margin + 14 + catWidth + 4, y + 24);

        // Budget
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        let detailY = y + 36;

        if (dest.budget) {
            doc.text(`Budget: ${dest.budget}`, margin + 10, detailY);
            detailY += 6;
        }

        if (dest.companions && dest.companions.length > 0) {
            doc.text(`Avec: ${dest.companions.join(', ')}`, margin + 10, detailY);
            detailY += 6;
        }

        if (dest.notes) {
            const truncatedNotes = dest.notes.length > 120 ? dest.notes.substring(0, 120) + '...' : dest.notes;
            const lines = doc.splitTextToSize(truncatedNotes, contentWidth - 20);
            doc.setFontSize(8);
            doc.setTextColor(156, 163, 175);
            doc.text(lines.slice(0, 2), margin + 10, detailY);
        }

        y += cardHeight + 8;
    });

    doc.save('my-travel-list.pdf');
}
