export interface TerminalType {
    id: number;
    name: string;
    description: string;
}

export const terminalTypes: Record<string, TerminalType> = {
    "Activity": {
        "id": 1,
        "name": "Activity",
        "description": "Interactive exercises for student engagement and hands-on learning"
    },
    "Animation": {
        "id": 2,
        "name": "Animation",
        "description": "Visual motion graphics that illustrate concepts and processes"
    },
    "AnswerKey": {
        "id": 3,
        "name": "AnswerKey",
        "description": "Solutions and explanations for assessments and activities"
    },
    "Article": {
        "id": 4,
        "name": "Article",
        "description": "Informative text content covering educational topics"
    },
    "Assessment": {
        "id": 5,
        "name": "Assessment",
        "description": "Evaluative tools to measure student understanding and progress"
    },
    "Diagram": {
        "id": 6,
        "name": "Diagram",
        "description": "Visual representations of concepts, processes, or relationships"
    },
    "FastFact": {
        "id": 7,
        "name": "FastFact",
        "description": "Quick, concise information snippets for rapid learning"
    },
    "FieldAssignment": {
        "id": 8,
        "name": "FieldAssignment",
        "description": "Outdoor or real-world tasks for experiential learning"
    },
    "Gallery": {
        "id": 9,
        "name": "Gallery",
        "description": "Collection of images or visual resources on a specific topic"
    },
    "Game": {
        "id": 10,
        "name": "Game",
        "description": "Educational games that make learning interactive and fun"
    },
    "InterdisciplinaryConnection": {
        "id": 11,
        "name": "InterdisciplinaryConnection",
        "description": "Content that connects multiple subject areas or disciplines"
    },
    "JournalQuestion": {
        "id": 12,
        "name": "JournalQuestion",
        "description": "Reflective prompts for student writing and critical thinking"
    },
    "Laboratory": {
        "id": 13,
        "name": "Laboratory",
        "description": "Experimental activities for scientific exploration and discovery"
    },
    "LessonPlan": {
        "id": 14,
        "name": "LessonPlan",
        "description": "Structured teaching guides with objectives, activities, and assessments"
    },
    "Photo": {
        "id": 15,
        "name": "Photo",
        "description": "Photographic images for visual learning and reference"
    },
    "SupportingMaterial": {
        "id": 16,
        "name": "SupportingMaterial",
        "description": "Supplementary resources that enhance primary learning content"
    },
    "TeachersGuide": {
        "id": 17,
        "name": "TeachersGuide",
        "description": "Instructional materials designed to assist educators"
    },
    "TechnologyTool": {
        "id": 18,
        "name": "TechnologyTool",
        "description": "Digital applications or software for educational purposes"
    },
    "Tool": {
        "id": 19,
        "name": "Tool",
        "description": "Resources or instruments that facilitate learning or teaching"
    },
    "Video": {
        "id": 20,
        "name": "Video",
        "description": "Audiovisual content for dynamic learning experiences"
    },
    "VocabularyTerm": {
        "id": 21,
        "name": "VocabularyTerm",
        "description": "Key terms and definitions essential to subject understanding"
    },
    "WebLink": {
        "id": 22,
        "name": "WebLink",
        "description": "External online resources that complement learning materials"
    },
    "LessonPlanItem": {
        "id": 23,
        "name": "LessonPlanItem",
        "description": "Individual component or activity within a lesson plan"
    },
    "LessonPlanSection": {
        "id": 24,
        "name": "LessonPlanSection",
        "description": "Major division or segment within a comprehensive lesson plan"
    },
    "LessonPlanSectionItem": {
        "id": 25,
        "name": "LessonPlanSectionItem",
        "description": "Specific element within a lesson plan section"
    },
    "ResourceCollection": {
        "id": 26,
        "name": "ResourceCollection",
        "description": "Curated group of related educational materials and resources"
    },
    "AssessmentQuestion": {
        "id": 27,
        "name": "AssessmentQuestion",
        "description": "Individual test items designed to evaluate specific knowledge"
    },
    "Curriculum": {
        "id": 28,
        "name": "Curriculum",
        "description": "Comprehensive educational program with sequenced learning objectives"
    },
    "CurriculumSection": {
        "id": 29,
        "name": "CurriculumSection",
        "description": "Distinct unit or module within a broader curriculum"
    },
    "InternationalConnection": {
        "id": 30,
        "name": "InternationalConnection",
        "description": "Content that provides global context or cross-cultural perspectives"
    },
    "MathConnection": {
        "id": 31,
        "name": "MathConnection",
        "description": "Materials that integrate mathematical concepts with other subjects"
    },
    "ParentEngagement": {
        "id": 32,
        "name": "ParentEngagement",
        "description": "Resources designed to involve families in student learning"
    },
    "DataSheet": {
        "id": 33,
        "name": "DataSheet",
        "description": "Organized collections of facts, figures, or information for analysis"
    },
    "TeacherResourceCollection": {
        "id": 34,
        "name": "TeacherResourceCollection",
        "description": "Compiled materials specifically for educator use and planning"
    },
    "HostResearcher": {
        "id": 35,
        "name": "HostResearcher",
        "description": "Expert profiles or content from subject matter specialists"
    },
    "Audio": {
        "id": 36,
        "name": "Audio",
        "description": "Sound-based learning materials for auditory learners"
    },
    "CurriculumSectionStage": {
        "id": 37,
        "name": "CurriculumSectionStage",
        "description": "Progressive phase within a curriculum section's learning sequence"
    },
    "CurriculumLesson": {
        "id": 38,
        "name": "CurriculumLesson",
        "description": "Individual instructional unit within a curriculum framework"
    },
    "CurriculumLessonStage": {
        "id": 39,
        "name": "CurriculumLessonStage",
        "description": "Specific phase or component within a curriculum lesson"
    },
    "CurriculumSectionIntroduction": {
        "id": 40,
        "name": "CurriculumSectionIntroduction",
        "description": "Opening materials that prepare students for a curriculum section"
    },
    "CurriculumSectionConclusion": {
        "id": 41,
        "name": "CurriculumSectionConclusion",
        "description": "Closing materials that summarize and assess a curriculum section"
    },
    "Image": {
        "id": 42,
        "name": "Image",
        "description": "Visual representations including diagrams, charts, and illustrations"
    },
    "ContentCollection": {
        "id": 43,
        "name": "ContentCollection",
        "description": "Organized compilation of related educational content and media"
    }
};