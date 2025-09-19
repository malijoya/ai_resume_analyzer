import React from 'react'

interface Suggestion {
    type: "good" | "improve"
    tip: string
}

interface ATSProps {
    score: number
    suggestion: Suggestion[]
}

const ATS: React.FC<ATSProps> = ({ score, suggestion }) => {
    // Determine gradient background based on score
    const getGradientClass = () => {
        if (score > 69) return 'from-green-100'
        if (score > 49) return 'from-yellow-100'
        return 'from-red-100'
    }

    // Determine icon based on score
    const getIconPath = () => {
        if (score > 69) return '/icons/ats-good.svg'
        if (score > 49) return '/icons/ats-warning.svg'
        return '/icons/ats-bad.svg'
    }

    // Determine icon for suggestions
    const getSuggestionIcon = (type: "good" | "improve") => {
        return type === "good" ? '/icons/check.svg' : '/icons/warning.svg'
    }

    return (
        <div className={`bg-gradient-to-br ${getGradientClass()} to-white rounded-lg shadow-lg p-6`}>
            {/* Top Section */}
            <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <img 
                        src={getIconPath()} 
                        alt="ATS Score Icon" 
                        className="w-5 h-5"
                    />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                    ATS Score - {score}/100
                </h2>
            </div>

            {/* Description Section */}
            <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Great Job!
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                    This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
                </p>

                {/* Suggestions List */}
                <div className="space-y-2">
                    {suggestion.map((item, index) => (
                        <div key={index} className="flex items-start">
                            <img 
                                src={getSuggestionIcon(item.type)} 
                                alt={`${item.type} icon`}
                                className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0"
                            />
                            <span className={`text-sm ${item.type === "good" ? "text-green-600" : "text-orange-500"}`}>
                                {item.tip}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Closing Line */}
            <div className="text-center pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-600 italic">
                    Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
                </p>
            </div>

            {/* Details Link */}
            <div className="text-center mt-2">
                <span className="text-xs text-gray-500">Details</span>
            </div>
        </div>
    )
}

export default ATS
