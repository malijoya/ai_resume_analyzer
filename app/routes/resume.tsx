import React, {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from "react-router";
import {resumes} from "../../constants";
import {usePuterStore} from "~/lib/puter";
import ATS from "~/components/ATS";
import { Summary } from "~/components/Summary";
import Details from "~/components/Details";

export const meta = () => ([
    {title : 'Resumind | Review'},
    {name : 'description', content : 'Detailed overview of your resume' },
])

const Resume = () => {

    const { auth, isLoading, fs, kv,} = usePuterStore();
    const {id} = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const loadResume = async () => {
            try {
                const resume = await kv.get(`resume${id}`);

                if(!resume) return;

                const data = JSON.parse(resume);
                console.log('Resume data:', data);

                // Validate paths exist and are files, not directories
                if (!data.resumePath || !data.imageFile) {
                    console.error('Missing resumePath or imageFile in data:', data);
                    return;
                }

                // Check if paths are directories by trying to read them
                try {
                    console.log('Attempting to read resume from:', data.resumePath);
                    const resumeBlob = await fs.read(data.resumePath);
                    if(!resumeBlob) {
                        console.error('Resume blob not found at:', data.resumePath);
                        return;
                    }

                    const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
                    const resumeUrl = URL.createObjectURL(pdfBlob);
                    setResumeUrl(resumeUrl);

                    console.log('Attempting to read image from:', data.imageFile);
                    const imageBlob = await fs.read(data.imageFile);
                    if(!imageBlob) {
                        console.error('Image blob not found at:', data.imageFile);
                        return;
                    }

                    const imageUrl = URL.createObjectURL(imageBlob);
                    setImageUrl(imageUrl);

                    setFeedback(data.feedback || '');
                    console.log('Successfully loaded resume and image');
                } catch (readError) {
                    console.error('Error reading files:', readError);
                    console.error('Resume path:', data.resumePath);
                    console.error('Image path:', data.imageFile);
                    
                    // Check if the error is specifically about reading a directory
                    if (readError.code === 'cannot_read_a_directory') {
                        console.error('The path points to a directory, not a file. Please check the stored paths.');
                        console.error('You may need to update the file paths in your KV store to point to actual files.');
                    }
                }
            } catch (error) {
                console.error('Failed to load resume:', error);
            }
        }
        loadResume();

    }, [id]);

    return (
        <main className='!pt-0'>
            <nav className='resume-nav'>
                <Link to="/" className="back-button">
                    <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
                    <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
                </Link>
            </nav>
            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center ">
                    {imageUrl && resumeUrl && (
                        <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
                            <a>
                                <img src={imageUrl}
                                className="w-full h-full object-contain rounded-2xl"
                                title="resume"/>

                            </a>

                        </div>
                    )}

                </section>

                {/* Feedback Section */}
                <section className="flex-1 p-6 bg-gray-50">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Resume Review</h1>
                    
                    {/* Overall Resume Score */}
                    {feedback && (
                        <div className="mb-6">
                            <Summary feedback={feedback} />
                        </div>
                    )}
                    
                    {/* ATS Score Card */}
                    {feedback && feedback.ATS && (
                        <div className="mb-6">
                            <ATS 
                                score={feedback.ATS.score || 0} 
                                suggestion={feedback.ATS.tips || []}
                            />
                        </div>
                    )}

                    {/* Details Section */}
                    {feedback && (
                        <div className="mb-6">
                            <Details feedback={feedback} />
                        </div>
                    )}
                </section>

            </div>

        </main>
    )
}
export default Resume
