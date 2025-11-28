/**
 * PDF Export Utility
 * 
 * Generates a clean, branded PDF export of the user's journey data
 * including daily notes and weekly reflections.
 */

import jsPDF from "jspdf";
import type { ProgressState } from "../context/progress-context";
import type { DayProgress, WeekProgress, AppSettings } from "../types/app";
import { getDateForDayNumber } from "./progress-time";
import { getWeekForDay, getDayIndexInWeek, YOGA_PROGRAM, TOTAL_DAYS } from "../data/yogaProgram";
import { computeStats } from "./progress-stats";
import { formatDate, formatDateLong } from "./date-format";

interface PDFOptions {
  progressState: ProgressState;
  userEmail?: string | null;
}

/**
 * Add a page header with branding
 */
function addHeader(doc: jsPDF, pageNumber: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // App name and branding
  doc.setFontSize(20);
  doc.setTextColor(31, 35, 41); // Dark gray matching design system
  doc.setFont("helvetica", "bold");
  doc.text("Daily Sutra", 20, 25);
  
  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text("A 52-week journey through the Yoga Sūtras", 20, 32);
  
  // Page number
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 20, 32, { align: "right" });
  
  // Subtle line separator
  doc.setDrawColor(220, 220, 220);
  doc.line(20, 38, pageWidth - 20, 38);
}

/**
 * Add summary statistics section
 */
function addSummarySection(
  doc: jsPDF,
  stats: ReturnType<typeof computeStats>,
  settings: AppSettings,
  userEmail?: string | null
) {
  let yPos = 50;
  
  // Title
  doc.setFontSize(16);
  doc.setTextColor(31, 35, 41);
  doc.setFont("helvetica", "bold");
  doc.text("Journey Summary", 20, yPos);
  yPos += 12;
  
  // Export date
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  const exportDate = formatDateLong(new Date());
  doc.text(`Exported on ${exportDate}`, 20, yPos);
  yPos += 8;
  
  if (userEmail) {
    doc.text(`Account: ${userEmail}`, 20, yPos);
    yPos += 8;
  }
  
  if (settings.startDate) {
    const startDate = formatDateLong(new Date(settings.startDate));
    doc.text(`Journey started: ${startDate}`, 20, yPos);
    yPos += 8;
  }
  
  yPos += 5;
  
  // Statistics in a clean grid
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  const statsData = [
    ["Days practiced", stats.daysPracticed.toString()],
    ["Days with notes", stats.totalDaysWithAnyData.toString()],
    ["Weeks completed", stats.completedWeeks.toString()],
    ["Bookmarked weeks", stats.bookmarkedWeeks.toString()],
    ["Practice completion", `${stats.practiceCompletionPercent.toFixed(1)}%`],
  ];
  
  const col1X = 20;
  const col2X = 120;
  const lineHeight = 7;
  
  statsData.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.text(label + ":", col1X, yPos);
    doc.setFont("helvetica", "bold");
    doc.text(value, col2X, yPos);
    yPos += lineHeight;
  });
  
  return yPos + 10;
}

/**
 * Add daily notes section
 */
function addDailyNotesSection(
  doc: jsPDF,
  dayProgress: Record<number, DayProgress>,
  settings: AppSettings,
  startY: number
): number {
  let yPos = startY;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  // Collect all days with notes
  const daysWithNotes: Array<{
    dayNumber: number;
    week: number;
    dayIndex: number;
    date: Date | null;
    note: string;
    didPractice: boolean;
  }> = [];
  
  for (let dayNumber = 1; dayNumber <= TOTAL_DAYS; dayNumber++) {
    const day = dayProgress[dayNumber];
    if (!day || !day.note || !day.note.trim()) continue;
    
    const week = getWeekForDay(dayNumber);
    const dayIndex = getDayIndexInWeek(dayNumber);
    if (!week || !dayIndex) continue;
    
    const date = getDateForDayNumber(settings, dayNumber);
    
    daysWithNotes.push({
      dayNumber,
      week: week.week,
      dayIndex,
      date,
      note: day.note.trim(),
      didPractice: day.didPractice,
    });
  }
  
  // Sort by day number (chronological)
  daysWithNotes.sort((a, b) => a.dayNumber - b.dayNumber);
  
  if (daysWithNotes.length === 0) {
    return yPos;
  }
  
  // Section title
  doc.setFontSize(16);
  doc.setTextColor(31, 35, 41);
  doc.setFont("helvetica", "bold");
  doc.text("Daily Notes", margin, yPos);
  yPos += 12;
  
  // Group by week
  let currentWeek = 0;
  
  for (const day of daysWithNotes) {
    // Check if we need a new page
    if (yPos > pageHeight - 60) {
      doc.addPage();
      const pageNumber = doc.getNumberOfPages();
      addHeader(doc, pageNumber, 0); // We'll update total pages later
      yPos = 50;
    }
    
    // Week header
    if (day.week !== currentWeek) {
      currentWeek = day.week;
      const weekData = YOGA_PROGRAM[currentWeek - 1];
      const weekTheme = weekData?.theme || "";
      
      yPos += 5;
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "bold");
      doc.text(`Week ${currentWeek}: ${weekTheme}`, margin, yPos);
      yPos += 8;
    }
    
    // Day entry
    const dateStr = formatDate(day.date) ?? "—";
    const dayLabel = `Day ${day.dayIndex} (${dateStr})`;
    
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(dayLabel, margin + 5, yPos);
    
    if (day.didPractice) {
      doc.setFontSize(8);
      doc.setTextColor(76, 175, 80); // Green for practiced
      doc.text("✓ Practiced", margin + 80, yPos);
    }
    
    yPos += 6;
    
    // Note text with word wrapping
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "normal");
    
    const lines = doc.splitTextToSize(day.note, maxWidth - 10);
    doc.text(lines, margin + 5, yPos);
    yPos += lines.length * 5 + 8;
  }
  
  return yPos + 10;
}

/**
 * Add weekly reflections section
 */
function addWeeklyReflectionsSection(
  doc: jsPDF,
  weekProgress: Record<number, WeekProgress>,
  startY: number
): number {
  let yPos = startY;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  // Collect weeks with reflections or flags
  const weeksWithData: Array<{
    weekNumber: number;
    completed: boolean;
    enjoyed: boolean;
    bookmarked: boolean;
    reflection: string;
  }> = [];
  
  for (let weekNumber = 1; weekNumber <= 52; weekNumber++) {
    const week = weekProgress[weekNumber];
    if (!week) continue;
    
    const hasReflection = week.reflectionNote.trim().length > 0;
    const hasFlags = week.completed || week.enjoyed || week.bookmarked;
    
    if (!hasReflection && !hasFlags) continue;
    
    weeksWithData.push({
      weekNumber,
      completed: week.completed,
      enjoyed: week.enjoyed,
      bookmarked: week.bookmarked,
      reflection: week.reflectionNote.trim(),
    });
  }
  
  // Sort by week number
  weeksWithData.sort((a, b) => a.weekNumber - b.weekNumber);
  
  if (weeksWithData.length === 0) {
    return yPos;
  }
  
  // Check if we need a new page
  if (yPos > pageHeight - 100) {
    doc.addPage();
    const pageNumber = doc.getNumberOfPages();
    addHeader(doc, pageNumber, 0);
    yPos = 50;
  }
  
  // Section title
  doc.setFontSize(16);
  doc.setTextColor(31, 35, 41);
  doc.setFont("helvetica", "bold");
  doc.text("Weekly Reflections", margin, yPos);
  yPos += 12;
  
  for (const week of weeksWithData) {
    // Check if we need a new page
    if (yPos > pageHeight - 80) {
      doc.addPage();
      const pageNumber = doc.getNumberOfPages();
      addHeader(doc, pageNumber, 0);
      yPos = 50;
    }
    
    const weekData = YOGA_PROGRAM[week.weekNumber - 1];
    const weekTheme = weekData?.theme || "";
    
    // Week header
    yPos += 5;
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    doc.setFont("helvetica", "bold");
    doc.text(`Week ${week.weekNumber}: ${weekTheme}`, margin, yPos);
    yPos += 6;
    
    // Flags
    const flags: string[] = [];
    if (week.completed) flags.push("Completed");
    if (week.enjoyed) flags.push("Enjoyed");
    if (week.bookmarked) flags.push("Bookmarked");
    
    if (flags.length > 0) {
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(flags.join(" • "), margin + 5, yPos);
      yPos += 6;
    }
    
    // Reflection text
    if (week.reflection) {
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "normal");
      
      const lines = doc.splitTextToSize(week.reflection, maxWidth - 10);
      doc.text(lines, margin + 5, yPos);
      yPos += lines.length * 5 + 10;
    } else {
      yPos += 5;
    }
  }
  
  return yPos;
}

/**
 * Generate and download a PDF export of the user's journey
 */
export function generatePDFExport(options: PDFOptions): void {
  const { progressState, userEmail } = options;
  const { dayProgress, weekProgress, settings } = progressState;
  
  // Create PDF document (A4 size)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });
  
  // Calculate statistics
  const stats = computeStats({ dayProgress, weekProgress });
  
  // Add first page header
  addHeader(doc, 1, 1); // Will update total pages later
  
  // Add summary section
  let yPos = addSummarySection(doc, stats, settings, userEmail);
  
  // Add daily notes section
  yPos = addDailyNotesSection(doc, dayProgress, settings, yPos);
  
  // Add weekly reflections section
  yPos = addWeeklyReflectionsSection(doc, weekProgress, yPos);
  
  // Update total page count in all headers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, 32, { align: "right" });
  }
  
  // Generate filename with date
  const dateStamp = new Date().toISOString().slice(0, 10);
  const filename = `dailysutra-journey-${dateStamp}.pdf`;
  
  // Save the PDF
  doc.save(filename);
}

