import React, { useState } from 'react'

interface Tip {
    type: "good" | "improve"
    tip: string
    explanation: string
}

interface CategoryDetails {
    score: number
    tips: Tip[]
}

interface DetailsProps {
    feedback: {
        toneAndStyle: CategoryDetails
        content: CategoryDetails
        structure: CategoryDetails
        skills: CategoryDetails
    }
}

const CategoryDetail = ({ title, category }: { title: string, category: CategoryDetails }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    const getScoreColor = (score: number) => {
        if (score > 70) return 'text-green-600'
        if (score > 49) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getScoreIcon = (score: number) => {
        if (score > 70) return '/icons/check.svg'
        if (score > 49) return '/icons/warning.svg'
        return '/icons/cross.svg'
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Header with dropdown arrow */}
            <div 
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                    <div className="flex items-center gap-2">
                        <img 
                            src={getScoreIcon(category.score)} 
                            alt={`${title} score icon`}
                            className="w-5 h-5"
                        />
                        <span className={`text-lg font-semibold ${getScoreColor(category.score)}`}>
                            {category.score}/100
                        </span>
                    </div>
                </div>
                
                {/* Dropdown Arrow */}
                <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                    <svg 
                        className="w-6 h-6 text-gray-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Collapsible content */}
            {isExpanded && (
                <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                    {category.tips.map((tip, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-start gap-3">
                                <img 
                                    src={tip.type === "good" ? '/icons/check.svg' : '/icons/warning.svg'} 
                                    alt={`${tip.type} icon`}
                                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                                />
                                <span className="text-gray-800 font-medium">{tip.tip}</span>
                            </div>
                            <div className={`ml-8 p-3 rounded-lg ${
                                tip.type === "good" 
                                    ? 'bg-green-50 border-l-4 border-green-400' 
                                    : 'bg-orange-50 border-l-4 border-orange-400'
                            }`}>
                                <p className="text-sm text-gray-700">{tip.explanation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const Details: React.FC<DetailsProps> = ({ feedback }) => {
    return (
        <div className="space-y-6">
            <CategoryDetail title="Tone & Style" category={feedback.toneAndStyle} />
            <CategoryDetail title="Content" category={feedback.content} />
            <CategoryDetail title="Structure" category={feedback.structure} />
            <CategoryDetail title="Skills" category={feedback.skills} />
        </div>
    )
}

export default Details