export interface TerminalType {
    id: number;
    name: string;
    description: string;
}

export const terminalTypes: Record<string, TerminalType> = {
    "Activity": {
        "id": 1,
        "name": "Activity",
        "description": "Hands-on learning exercises designed to reinforce concepts through student engagement and participation."
    },
    "Animation": {
        "id": 2,
        "name": "Animation",
        "description": "Short visual explanations that simplify complex topics and enhance student understanding through movement and storytelling."
    },
    "AnswerKey": {
        "id": 3,
        "name": "AnswerKey",
        "description": "Provides correct responses to exercises and assessments, supporting educators in grading and lesson follow-up."
    },
    "Article": {
        "id": 4,
        "name": "Article",
        "description": "Informational texts that offer background knowledge, real-world context, or extended learning opportunities."
    },
    "Assessment": {
        "id": 5,
        "name": "Assessment",
        "description": "Tools to measure student understanding and track progress across learning objectives."
    },
    "Diagram": {
        "id": 6,
        "name": "Diagram",
        "description": "Visual representations that break down processes, relationships, or systems to aid student comprehension."
    },
    "FastFact": {
        "id": 7,
        "name": "FastFact",
        "description": "Bite-sized pieces of information perfect for reinforcing key ideas or sparking curiosity."
    },
    "FieldAssignment": {
        "id": 8,
        "name": "FieldAssignment",
        "description": "Structured tasks encouraging students to explore and apply learning beyond the classroom."
    },
    "Gallery": {
        "id": 9,
        "name": "Gallery",
        "description": "Curated collections of images or resources that offer visual context and enhance thematic exploration."
    },
    "Game": {
        "id": 10,
        "name": "Game",
        "description": "Interactive learning tools that build skills and knowledge through play and challenge."
    },
    "InterdisciplinaryConnection": {
        "id": 11,
        "name": "InterdisciplinaryConnection",
        "description": "Highlights how concepts relate across subjects to support holistic learning and planning."
    },
    "JournalQuestion": {
        "id": 12,
        "name": "JournalQuestion",
        "description": "Prompts to encourage student reflection, critical thinking, and personal connection to the material."
    },
    "Laboratory": {
        "id": 13,
        "name": "Laboratory",
        "description": "Experiments and investigations that promote inquiry and application of scientific methods."
    },
    "LessonPlan": {
        "id": 14,
        "name": "LessonPlan",
        "description": "Comprehensive guides for delivering content with defined objectives, activities, and materials."
    },
    "Photo": {
        "id": 15,
        "name": "Photo",
        "description": "Real-world images that provide visual support and deepen engagement with content."
    },
    "SupportingMaterial": {
        "id": 16,
        "name": "SupportingMaterial",
        "description": "Additional content and tools that complement core lessons and enrich instruction."
    },
    "TeachersGuide": {
        "id": 17,
        "name": "TeachersGuide",
        "description": "Instructional overviews and suggestions designed to help educators implement content effectively."
    },
    "TechnologyTool": {
        "id": 18,
        "name": "TechnologyTool",
        "description": "Digital platforms or applications that enhance learning and streamline classroom management."
    },
    "Tool": {
        "id": 19,
        "name": "Tool",
        "description": "Practical resources that assist in instruction, assessment, or classroom facilitation."
    },
    "Video": {
        "id": 20,
        "name": "Video",
        "description": "Engaging visual content that illustrates topics, tells stories, or explains concepts dynamically."
    },
    "VocabularyTerm": {
        "id": 21,
        "name": "VocabularyTerm",
        "description": "Key words and definitions critical for building subject-area literacy."
    },
    "WebLink": {
        "id": 22,
        "name": "WebLink",
        "description": "Curated external resources that extend learning and offer further exploration opportunities."
    },
    "LessonPlanItem": {
        "id": 23,
        "name": "LessonPlanItem",
        "description": "Individual components of a lesson plan, such as objectives or procedures, for customizable planning."
    },
    "LessonPlanSection": {
        "id": 24,
        "name": "LessonPlanSection",
        "description": "Segmented parts of a lesson plan, like warm-ups or wrap-ups, to support structured teaching."
    },
    "LessonPlanSectionItem": {
        "id": 25,
        "name": "LessonPlanSectionItem",
        "description": "Detailed elements within a lesson section that guide pacing and instructional flow."
    },
    "ResourceCollection": {
        "id": 26,
        "name": "ResourceCollection",
        "description": "Bundled sets of resources around a theme or topic for comprehensive lesson planning."
    },
    "AssessmentQuestion": {
        "id": 27,
        "name": "AssessmentQuestion",
        "description": "Standalone questions to check understanding, build quizzes, or prompt class discussion."
    },
    "Curriculum": {
        "id": 28,
        "name": "Curriculum",
        "description": "Structured sequence of learning content aligned to educational standards and outcomes."
    },
    "CurriculumSection": {
        "id": 29,
        "name": "CurriculumSection",
        "description": "Subdivisions within a curriculum that organize content into manageable units."
    },
    "InternationalConnection": {
        "id": 30,
        "name": "InternationalConnection",
        "description": "Content that highlights global perspectives and encourages cultural understanding."
    },
    "MathConnection": {
        "id": 31,
        "name": "MathConnection",
        "description": "Resources linking math concepts to broader subject areas or real-life applications."
    },
    "ParentEngagement": {
        "id": 32,
        "name": "ParentEngagement",
        "description": "Tools and communication strategies to involve families in the learning process."
    },
    "DataSheet": {
        "id": 33,
        "name": "DataSheet",
        "description": "Organized charts or tables presenting information for analysis, reference, or activity support."
    },
    "TeacherResourceCollection": {
        "id": 34,
        "name": "TeacherResourceCollection",
        "description": "Curated materials tailored for educator use to enhance planning and instruction."
    },
    "HostResearcher": {
        "id": 35,
        "name": "HostResearcher",
        "description": "Profiles and insights from subject-matter experts to inspire deeper learning and authenticity."
    },
    "Audio": {
        "id": 36,
        "name": "Audio",
        "description": "Sound-based content including stories, interviews, or instructions to support auditory learners."
    },
    "CurriculumSectionStage": {
        "id": 37,
        "name": "CurriculumSectionStage",
        "description": "Specific stages within a curriculum section to guide teaching progression."
    },
    "CurriculumLesson": {
        "id": 38,
        "name": "CurriculumLesson",
        "description": "Individual lessons within the curriculum aligned to goals and learning objectives."
    },
    "CurriculumLessonStage": {
        "id": 39,
        "name": "CurriculumLessonStage",
        "description": "Phases of a lesson (e.g., introduction, practice) for clear instructional scaffolding."
    },
    "CurriculumSectionIntroduction": {
        "id": 40,
        "name": "CurriculumSectionIntroduction",
        "description": "An overview that sets the stage for learning within a new curriculum section."
    },
    "CurriculumSectionConclusion": {
        "id": 41,
        "name": "CurriculumSectionConclusion",
        "description": "A wrap-up that reviews key ideas and helps transition between sections."
    },
    "Image": {
        "id": 42,
        "name": "Image",
        "description": "Visuals that support content delivery, spark discussion, or illustrate core ideas."
    },
    "ContentCollection": {
        "id": 43,
        "name": "ContentCollection",
        "description": "Grouped resources that offer a cohesive approach to teaching specific topics."
    }
};