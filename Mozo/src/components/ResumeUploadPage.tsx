import  { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Check, Clock, X } from 'lucide-react';

interface ResumeUploadPageProps {
  onProceed: () => void;
}

const ResumeUploadPage = ({ onProceed }: ResumeUploadPageProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsed, setIsParsed] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock resume data after parsing
  const resumeData = {
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Node.js', 'REST APIs', 'Git'],
    experience: [
      { 
        title: 'Frontend Developer',
        company: 'Tech Solutions Inc.',
        period: '2020 - Present',
        description: 'Developed responsive web applications using React and TypeScript.'
      },
      {
        title: 'Junior Web Developer',
        company: 'Digital Creations',
        period: '2018 - 2020',
        description: 'Maintained client websites and implemented new features.'
      }
    ]
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile) {
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileType !== 'pdf' && fileType !== 'docx') {
        setError("Please upload a PDF or DOCX file");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError("");
    
    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (droppedFile) {
      const fileType = droppedFile.name.split('.').pop()?.toLowerCase();
      if (fileType !== 'pdf' && fileType !== 'docx') {
        setError("Please upload a PDF or DOCX file");
        return;
      }
      
      setFile(droppedFile);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate API call to parse resume
    setTimeout(() => {
      setIsUploading(false);
      setIsParsed(true);
    }, 2500);
  };

  const resetUpload = () => {
    setFile(null);
    setIsParsed(false);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="card">
          <div className="gradient-bg px-8 py-6 text-white">
            <h1 className="text-2xl font-bold text-center">Resume Upload</h1>
            <p className="text-center mt-2 text-indigo-100">
              Upload your resume to let us analyze your skills
            </p>
          </div>

          <div className="p-8">
            {!isParsed ? (
              <>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center 
                    ${file ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-400'} 
                    transition-colors duration-200 cursor-pointer`}
                  onClick={triggerFileInput}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx"
                  />
                  
                  <div className="flex flex-col items-center justify-center space-y-3 py-4">
                    {file ? (
                      <>
                        <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center">
                          <FileText className="h-7 w-7 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-primary-700 font-medium text-lg mb-1">{file.name}</p>
                          <p className="text-gray-500 text-sm">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            resetUpload();
                          }}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center"
                        >
                          <X size={16} className="mr-1" />
                          Remove
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
                          <Upload className="h-7 w-7 text-gray-500" />
                        </div>
                        <p className="text-lg font-medium text-gray-700">
                          Drag and drop your resume here
                        </p>
                        <p className="text-gray-500">
                          or <span className="text-primary-600">browse files</span>
                        </p>
                        <p className="text-sm text-gray-400">
                          Supports PDF, DOCX (Max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 mt-2 text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="mt-6 text-center">
                  <motion.button
                    className={`btn-primary w-full ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!file || isUploading}
                    onClick={handleUpload}
                    whileHover={file ? { scale: 1.02 } : {}}
                    whileTap={file ? { scale: 0.98 } : {}}
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Parsing Resume...
                      </div>
                    ) : (
                      <>Upload Resume</>
                    )}
                  </motion.button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Resume Parsed Successfully!
                </h2>
                
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                    <span className="bg-primary-100 p-1 rounded-full mr-2">
                      <FileText className="h-5 w-5 text-primary-700" />
                    </span>
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resumeData.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-primary-50 text-primary-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-800 mb-3 mt-6 flex items-center">
                    <span className="bg-primary-100 p-1 rounded-full mr-2">
                      <Clock className="h-5 w-5 text-primary-700" />
                    </span>
                    Experience
                  </h3>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-primary-200 pl-4 py-1">
                        <h4 className="font-medium text-gray-800">{exp.title}</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-primary-700">{exp.company}</span>
                          <span className="text-gray-500">{exp.period}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                  <motion.button
                    className="btn-secondary"
                    onClick={resetUpload}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Upload Different Resume
                  </motion.button>
                  
                  <motion.button
                    className="btn-primary"
                    onClick={onProceed}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Proceed to Interview
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeUploadPage;
 