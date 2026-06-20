'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Layers, Sparkles, Loader2, ListChecks, CheckCircle2, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

interface QuizOption {
  id: number;
  option_text: string;
  is_correct: boolean;
}

interface QuizQuestion {
  id: number;
  question_text: string;
  options: QuizOption[];
}

interface Subtopic {
  id: number;
  subtopicName: string;
  explanation?: string | null;
}

interface Chapter {
  chapterName: string;
  subtopics: Subtopic[];
}

interface Roadmap {
  mainTopic: string;
  routerLink: string;
  intro: string;
  chapters: Chapter[];
}

export default function CourseDetails({ roadmap }: { roadmap: Roadmap }) {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([0])); // First chapter open by default
  const [explanations, setExplanations] = useState<Record<number, string>>({});
  const [loadingExplanations, setLoadingExplanations] = useState<Set<number>>(new Set());
  const [activeSubtopicId, setActiveSubtopicId] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<Record<number, QuizQuestion[]>>({});
  const [loadingQuizzes, setLoadingQuizzes] = useState<Set<number>>(new Set());
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, Record<number, number>>>({}); // subtopicId -> questionId -> optionId

  const toggleChapter = (index: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChapters(newExpanded);
  };

  const handleExplain = async (subtopicId: number) => {
    const hasExplanation = explanations[subtopicId] || roadmap.chapters.some(c => c.subtopics.find(s => s.id === subtopicId)?.explanation);
    
    if (hasExplanation) {
      // Toggle if already explained
      setActiveSubtopicId(activeSubtopicId === subtopicId ? null : subtopicId);
      return;
    }

    setActiveSubtopicId(subtopicId);
    let referenceUrl = 'https://prabhupada.io/';
    if (roadmap.routerLink === 'nector-of-instructions') referenceUrl = 'https://prabhupada.io/noi';
    else if (roadmap.routerLink === 'srimad-bhagavad-gita-as-it-is') referenceUrl = 'https://prabhupada.io/bg';

    setLoadingExplanations(prev => new Set(prev).add(subtopicId));
    try {
      const response = await axios.post('https://api.askharekrishna.com/api/course-roadmap/explain-subtopic/', {
        subtopic_id: subtopicId,
        reference_url: referenceUrl
      }, {
        auth: {
          username: 'narasimha',
          password: 'Bala#$88'
        }
      });
      setExplanations(prev => ({ ...prev, [subtopicId]: response.data.explanation }));
    } catch (error) {
      console.error('Error generating explanation:', error);
    } finally {
      setLoadingExplanations(prev => {
        const next = new Set(prev);
        next.delete(subtopicId);
        return next;
      });
    }
  };

  const handleAttendQuiz = async (subtopicId: number) => {
    if (quizzes[subtopicId]) {
      setActiveQuiz(activeQuiz === subtopicId ? null : subtopicId);
      return;
    }

    setLoadingQuizzes(prev => new Set(prev).add(subtopicId));
    try {
      const response = await axios.post('https://api.askharekrishna.com/api/course-roadmap/subtopic-quiz/', {
        subtopic_id: subtopicId
      }, {
        auth: {
          username: 'narasimha',
          password: 'Bala#$88'
        }
      });
      setQuizzes(prev => ({ ...prev, [subtopicId]: response.data.questions }));
      setActiveQuiz(subtopicId);
      setSelectedAnswers(prev => ({ ...prev, [subtopicId]: {} }));
    } catch (error) {
      console.error('Error generating quiz:', error);
    } finally {
      setLoadingQuizzes(prev => {
        const next = new Set(prev);
        next.delete(subtopicId);
        return next;
      });
    }
  };

  const handleSelectAnswer = (subtopicId: number, questionId: number, optionId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [subtopicId]: {
        ...(prev[subtopicId] || {}),
        [questionId]: optionId
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 sm:p-12 mb-10 shadow-lg">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary font-semibold text-sm mb-6">
              <BookOpen size={16} />
              <span>Learning Roadmap</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black text-text-main dark:text-white tracking-tight mb-6 leading-tight">
              {roadmap.mainTopic}
            </h1>
            
            <p className="text-lg text-text-muted dark:text-gray-300 max-w-2xl leading-relaxed">
              {roadmap.intro}
            </p>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-main dark:text-white flex items-center gap-3 mb-6 px-2">
            <Layers className="text-primary" size={24} />
            Course Curriculum
            <span className="text-sm font-medium bg-gray-100 dark:bg-neutral-800 text-text-muted dark:text-gray-400 px-3 py-1 rounded-full ml-2">
              {roadmap.chapters.length} Chapters
            </span>
          </h2>

          {roadmap.chapters.map((chapter, index) => {
            const isExpanded = expandedChapters.has(index);
            
            return (
              <div 
                key={index} 
                className={`rounded-2xl transition-all duration-300 overflow-hidden border ${
                  isExpanded 
                    ? 'border-primary/30 shadow-md bg-white dark:bg-[#1a150c]' 
                    : 'border-[#f3efe7] dark:border-neutral-800 bg-white/50 dark:bg-background-dark/50 hover:border-primary/20'
                }`}
              >
                <button
                  onClick={() => toggleChapter(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-colors ${
                      isExpanded 
                        ? 'bg-primary text-black' 
                        : 'bg-gray-100 dark:bg-neutral-800 text-text-muted group-hover:bg-primary/20 group-hover:text-primary'
                    }`}>
                      {index + 1}
                    </div>
                    <h3 className={`text-lg font-bold transition-colors ${
                      isExpanded ? 'text-text-main dark:text-white' : 'text-text-main dark:text-gray-200 group-hover:text-primary'
                    }`}>
                      {chapter.chapterName}
                    </h3>
                  </div>
                  
                  <div className={`p-2 rounded-full transition-transform duration-300 ${isExpanded ? 'bg-primary/10 text-primary rotate-180' : 'text-text-muted'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[2000px] opacity-100 mb-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-2 pt-2 ml-14">
                    <ul className="space-y-3 relative before:absolute before:inset-y-0 before:left-[-15px] before:w-px before:bg-gradient-to-b before:from-primary/50 before:to-transparent">
                      {chapter.subtopics.map((subtopic, subIndex) => (
                        <li 
                          key={subIndex} 
                          className="flex flex-col group relative before:absolute before:left-[-15px] before:top-3 before:w-3 before:h-px before:bg-primary/50"
                        >
                          <div className="flex items-start justify-between w-full">
                            <div className="flex items-start">
                              <div className="mt-0.5 mr-3 text-primary/40 group-hover:text-primary transition-colors">
                                <ChevronRight size={16} />
                              </div>
                              <span className="text-[15px] font-medium text-text-main dark:text-gray-200 mt-[1px]">
                                {subtopic.subtopicName}
                              </span>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExplain(subtopic.id);
                              }}
                              disabled={loadingExplanations.has(subtopic.id)}
                              className={`ml-4 shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                (explanations[subtopic.id] || subtopic.explanation)
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 cursor-pointer shadow-sm'
                                  : 'bg-primary/10 text-primary hover:bg-primary hover:text-black shadow-sm'
                              }`}
                            >
                              {loadingExplanations.has(subtopic.id) ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (explanations[subtopic.id] || subtopic.explanation) ? (
                                <BookOpen size={14} />
                              ) : (
                                <Sparkles size={14} />
                              )}
                              <span>
                                {(explanations[subtopic.id] || subtopic.explanation) 
                                  ? (activeSubtopicId === subtopic.id ? 'Close' : 'Read') 
                                  : 'Explain'}
                              </span>
                            </button>
                          </div>

                          {(explanations[subtopic.id] || subtopic.explanation) && activeSubtopicId === subtopic.id && (
                            <div className="mt-4 ml-7 p-5 rounded-2xl bg-[#fefdfb] dark:bg-neutral-800/50 border border-[#f3efe7] dark:border-neutral-800 animate-in fade-in slide-in-from-top-2 duration-300">
                              <div className="prose prose-sm dark:prose-invert max-w-none text-text-muted dark:text-gray-300">
                                <ReactMarkdown>
                                  {(explanations[subtopic.id] || subtopic.explanation) as string}
                                </ReactMarkdown>
                              </div>
                              
                              <div className="mt-6 flex justify-end">
                                <button
                                  onClick={() => handleAttendQuiz(subtopic.id)}
                                  disabled={loadingQuizzes.has(subtopic.id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
                                >
                                  {loadingQuizzes.has(subtopic.id) ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    <ListChecks size={16} />
                                  )}
                                  <span>{activeQuiz === subtopic.id ? 'Close Quiz' : 'Attend Quiz'}</span>
                                </button>
                              </div>

                              {activeQuiz === subtopic.id && quizzes[subtopic.id] && (
                                <div className="mt-6 pt-6 border-t border-[#f3efe7] dark:border-neutral-800 animate-in fade-in slide-in-from-top-4 duration-300">
                                  <h4 className="text-xl font-black text-text-main dark:text-white mb-6 flex items-center gap-2">
                                    <ListChecks className="text-primary" size={24} />
                                    Knowledge Check
                                  </h4>
                                  
                                  <div className="space-y-8">
                                    {quizzes[subtopic.id].map((question, qIndex) => {
                                      const selectedOptionId = selectedAnswers[subtopic.id]?.[question.id];
                                      
                                      return (
                                        <div key={question.id} className="bg-white dark:bg-[#1a150c] p-6 rounded-xl shadow-sm border border-[#f3efe7] dark:border-neutral-800">
                                          <p className="font-bold text-text-main dark:text-gray-200 mb-4 text-base">
                                            <span className="text-primary mr-2">{qIndex + 1}.</span>
                                            {question.question_text}
                                          </p>
                                          
                                          <div className="space-y-2.5">
                                            {question.options.map((option) => {
                                              const isSelected = selectedOptionId === option.id;
                                              const showAnswer = selectedOptionId !== undefined; // Reveal if any option clicked
                                              
                                              let optionClasses = "w-full text-left px-4 py-3 rounded-lg border-2 transition-all flex items-center justify-between group";
                                              let icon = null;
                                              
                                              if (showAnswer) {
                                                if (option.is_correct) {
                                                  optionClasses += " border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300";
                                                  icon = <CheckCircle2 size={18} className="text-green-500 shrink-0" />;
                                                } else if (isSelected) {
                                                  optionClasses += " border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300";
                                                  icon = <XCircle size={18} className="text-red-500 shrink-0" />;
                                                } else {
                                                  optionClasses += " border-transparent bg-gray-50 dark:bg-neutral-800/50 text-text-muted opacity-50";
                                                }
                                              } else {
                                                optionClasses += " border-transparent bg-gray-50 dark:bg-neutral-800/50 text-text-muted hover:bg-primary/5 hover:border-primary/30 cursor-pointer";
                                              }
                                              
                                              return (
                                                <button
                                                  key={option.id}
                                                  disabled={showAnswer}
                                                  onClick={() => handleSelectAnswer(subtopic.id, question.id, option.id)}
                                                  className={optionClasses}
                                                >
                                                  <span className="font-medium text-sm pr-4">{option.option_text}</span>
                                                  {icon}
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
