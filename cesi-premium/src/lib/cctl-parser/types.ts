import { CCTLQuestionType, CCTLStudentStatus, CCTLChoice, CCTLMatchingPair, CCTLFillBlankItem } from '@/types/cctl';

export interface VisualItem {
    text: string;
    x: number;
}

export interface VisualLine {
    page: number;
    y: number;
    items: VisualItem[];
    fullText: string;
}

export interface SectionData {
    id: string;
    title: string;
    startLineIndex: number;
    endLineIndex?: number;
    codeSnippet?: string;
    codeLanguage?: string;
    introText?: string;
    questionCount: number;
}

export interface QuestionBoundary {
    globalNumber: number;
    sectionQuestionNumber: number;
    sectionTitle: string;
    sectionData: SectionData;
    lineIndex: number;
}

export interface ParsedQuestionResult {
    rawType: string;
    qType: CCTLQuestionType;
    status: CCTLStudentStatus;
    statusRaw?: string;
    discordanceCount: number;
    prompt: string;
    codeSnippet?: string;
    codeLanguage?: string;
    choices: CCTLChoice[];
    matchingPairs?: CCTLMatchingPair[];
    fillBlanks?: CCTLFillBlankItem[];
    rawText: string;
}
