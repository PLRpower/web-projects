import { VisualLine, QuestionBoundary, SectionData } from './types';

export interface RasterizedExamVisuals {
    questionSnapshots: Map<number, string>;
    promptSnapshots: Map<number, string>;
    choiceSnapshots: Map<string, string>; // key: `${qGlobalNumber}_${choiceId}`
}

/**
 * Visual snapshots stub without heavy native canvas dependencies.
 * All question text, choices, code blocks, and formulas are directly parsed from PDF vector stream.
 */
export async function generateQuestionSnapshots(
    _pdfBuffer: Uint8Array,
    _visualLines: VisualLine[],
    _questionStarts: QuestionBoundary[],
    _detectedSections: SectionData[]
): Promise<RasterizedExamVisuals> {
    return {
        questionSnapshots: new Map<number, string>(),
        promptSnapshots: new Map<number, string>(),
        choiceSnapshots: new Map<string, string>()
    };
}


