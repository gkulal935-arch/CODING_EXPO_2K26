import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAudio } from '../hooks/useAudio';
import { Plus, Trash2, ArrowLeft, ArrowRight, Upload, Sparkles, CheckCircle2, Cpu, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ProjectShowcase: React.FC = () => {
  const { playHover, playClick } = useAudio();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Scroll Ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState<string[]>(['', '']); // Initially show 2 members
  const [classSection, setClassSection] = useState('I BCA A');
  const [description, setDescription] = useState('');
  
  // File states
  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [bannerChart, setBannerChart] = useState<File | null>(null);
  const [demoVideo, setDemoVideo] = useState<File | null>(null);
  
  // Preview states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Drag and drop / upload states
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [newlySubmittedProject, setNewlySubmittedProject] = useState<any | null>(null);

    // Fetch submitted projects from Node local database
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch student projects:', response.statusText);
      }
    } catch (err) {
      console.error('Failed to connect to local Express server:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Horizontal Scroll navigator triggers
  const handleScroll = (direction: 'left' | 'right') => {
    playClick();
    if (scrollContainerRef.current) {
      const cardOffset = 380; // card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -cardOffset : cardOffset,
        behavior: 'smooth'
      });
    }
  };

  // Dynamic Add Member Input field triggers
  const handleAddMember = () => {
    playClick();
    setMembers([...members, '']);
  };

  const handleMemberChange = (index: number, val: string) => {
    const updated = [...members];
    updated[index] = val;
    setMembers(updated);
  };

  const handleRemoveMember = (index: number) => {
    playClick();
    if (members.length <= 2) return; // Keep at least 2 members initially
    const updated = [...members];
    updated.splice(index, 1);
    setMembers(updated);
  };

  // Handle File uploads and triggers preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'banner' | 'video') => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (type === 'image') {
      setProjectImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else if (type === 'banner') {
      setBannerChart(file);
      setBannerPreview(URL.createObjectURL(file));
    } else if (type === 'video') {
      handleVideoFile(file);
    }
  };

  const handleVideoFile = (file: File) => {
    // Basic extension check for support
    const supportedExts = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
    const fileName = file.name.toLowerCase();
    const isSupported = supportedExts.some(ext => fileName.endsWith(ext));
    if (!isSupported) {
      alert('Unsupported video format. Please upload an MP4, MOV, AVI, WebM, or MKV file.');
      return;
    }
    setDemoVideo(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  // Submit to Express Server multipart API using XMLHttpRequest for progress tracking
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();

    if (!title.trim() || !description.trim() || !projectImage || !bannerChart || !demoVideo) {
      alert('Please fill in all details and upload all three required media layers (Screenshot, Banner, and Demo Video).');
      return;
    }

    const filteredMembers = members.filter(m => m.trim() !== '');
    if (filteredMembers.length < 2) {
      alert('Please list at least 2 team members for project submission.');
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('members', JSON.stringify(filteredMembers));
    formData.append('classSection', classSection);
    formData.append('description', description);
    formData.append('projectImage', projectImage);
    formData.append('bannerChart', bannerChart);
    formData.append('demoVideo', demoVideo);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_URL}/api/projects`);

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (xhr.status >= 200 && xhr.status < 300) {
          const newlyCreated = JSON.parse(xhr.responseText);
          // Instantly reflect newly added projects into cards state list
          setProjects(prev => [newlyCreated, ...prev]);

          // Reset forms fields
          setTitle('');
          setMembers(['', '']);
          setClassSection('I BCA A');
          setDescription('');
          setProjectImage(null);
          setBannerChart(null);
          setDemoVideo(null);
          setImagePreview(null);
          setBannerPreview(null);
          setVideoPreview(null);

          // Trigger premium canvas-confetti burst
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#8b5cf6', '#00ff88', '#ec4899']
          });

          // Set the newly submitted project details to trigger success modal
          setNewlySubmittedProject(newlyCreated);

          // Show Success toast
          setSubmitSuccess(true);
          setTimeout(() => setSubmitSuccess(false), 3000);
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            alert(`Submission Failed: ${errorData.error || 'Server error'}`);
          } catch {
            alert(`Submission Failed with status: ${xhr.status}`);
          }
        }
        setIsSubmitting(false);
      };

      xhr.onerror = () => {
        setIsUploading(false);
        setIsSubmitting(false);
        alert('Local Express server connection lost. Submission cannot be completed.');
      };

      xhr.send(formData);
    } catch (err) {
      setIsUploading(false);
      setIsSubmitting(false);
      alert('An error occurred during submission.');
    }
  };

  const openDetails = (project: any) => {
    playClick();
    setSelectedProject(project);
  };

  const closeDetails = () => {
    playClick();
    setSelectedProject(null);
  };

  const getMediaUrl = (pathStr: string) => {
    if (!pathStr) return '';
    if (pathStr.startsWith('http')) return pathStr;
    return `${API_URL}${pathStr}`;
  };

  return (
    <section 
      id="showcase" 
      style={{
        padding: '100px 0 80px',
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(to bottom, transparent, rgba(5, 8, 22, 0.95) 15%, rgba(5, 8, 22, 0.95) 85%, transparent)'
      }}
    >
      <div className="container">
        
        {/* ================= PROJECT CARDS SHOWCASE HEADER ================= */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span 
              style={{ 
                fontFamily: "'Space Grotesk', sans-serif", 
                fontSize: '0.85rem', 
                color: '#00f0ff', 
                letterSpacing: '3px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '10px'
              }}
              className="text-glow-cyan"
            >
              Exhibition Track
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, letterSpacing: '0.5px' }}>
              Student Projects
            </h2>
          </div>
          
          {/* Scroll Navigation Arrows (Desktop only) */}
          {!isLoading && projects.length > 0 && (
            <div style={{ display: 'flex', gap: '15px' }}>
              <button
                onClick={() => handleScroll('left')}
                onMouseEnter={playHover}
                className="clickable"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  color: '#00f0ff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 10px rgba(0, 240, 255, 0.05)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 240, 255, 0.05)';
                }}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => handleScroll('right')}
                onMouseEnter={playHover}
                className="clickable"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: '#8b5cf6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 10px rgba(139, 92, 246, 0.05)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.05)';
                }}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* ================= DYNAMIC PROJECTS CONTENT AREA ================= */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', minHeight: '300px', marginBottom: '80px' }}>
            <div style={{ textAlign: 'center', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif" }}>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{
                  margin: '0 auto 15px',
                  width: '32px',
                  height: '32px',
                  border: '3px solid rgba(0, 240, 255, 0.15)',
                  borderTopColor: '#00f0ff',
                  borderRadius: '50%',
                }}
              />
              <span style={{ fontSize: '0.95rem', letterSpacing: '1px' }}>Establishing link to database and indexers...</span>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '80px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '100%',
                maxWidth: '650px',
                margin: '20px auto',
                padding: '40px 30px',
                borderRadius: '16px',
                background: 'rgba(12, 17, 43, 0.4)',
                border: '1px dashed rgba(0, 240, 255, 0.3)',
                boxShadow: '0 0 30px rgba(0, 240, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                overflow: 'hidden'
              }}
            >
              {/* Scanline / Grid overlay */}
              <div className="scanline-overlay" style={{ opacity: 0.05 }} />

              {/* Floating Holographic Sphere / Illustration */}
              <motion.div
                animate={{ 
                  y: [0, -12, 0],
                  rotateY: [0, 180, 360]
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  rotateY: { repeat: Infinity, duration: 12, ease: "linear" }
                }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, rgba(0, 240, 255, 0.1) 60%, transparent 100%)',
                  border: '2px solid rgba(0, 240, 255, 0.5)',
                  boxShadow: '0 0 25px rgba(0, 240, 255, 0.4), inset 0 0 15px rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '25px',
                  position: 'relative'
                }}
              >
                {/* Floating internal icon details */}
                <Cpu size={36} style={{ color: '#00f0ff', filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
                
                {/* Orbiting rings */}
                <span style={{
                  position: 'absolute',
                  width: '100px',
                  height: '100px',
                  border: '1px dashed rgba(139, 92, 246, 0.4)',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
              </motion.div>

              {/* Text Titles */}
              <h3 style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#fff',
                marginBottom: '12px',
                letterSpacing: '2px',
                background: 'linear-gradient(90deg, #00f0ff, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 5px rgba(0, 240, 255, 0.2))'
              }}>
                No Projects Found
              </h3>

              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.9rem',
                color: '#9ca3af',
                lineHeight: '1.6',
                maxWidth: '450px',
                margin: '0 auto 24px'
              }}>
                The dynamic project database is currently empty. Be the first student team to publish and showcase your engineering work!
              </p>

              {/* Futuristic interactive button trigger helper */}
              <button
                onClick={() => {
                  playClick();
                  document.getElementById('submission-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                onMouseEnter={playHover}
                className="clickable"
                style={{
                  padding: '10px 20px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#00f0ff',
                  backgroundColor: 'rgba(0, 240, 255, 0.05)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  letterSpacing: '1px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 0 15px rgba(0, 240, 255, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.15)';
                  e.currentTarget.style.borderColor = '#00f0ff';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.35)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.1)';
                }}
              >
                SUBMIT PROJECT
              </button>
            </motion.div>
          </div>
        ) : (
          <div 
            ref={scrollContainerRef}
            className="horizontal-scroll-track"
            style={{
              display: 'flex',
              flexDirection: 'row',
              overflowX: 'auto',
              gap: '30px',
              padding: '20px 10px',
              scrollBehavior: 'smooth',
              width: '100%',
              marginBottom: '80px',
              maskImage: 'linear-gradient(to right, #000 92%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, #000 92%, transparent 100%)'
            }}
          >
            {projects.map((project, idx) => (
              <motion.div
                key={project._id || idx}
                onClick={() => openDetails(project)}
                onMouseEnter={playHover}
                className="glass-panel clickable"
                style={{
                  flex: '0 0 350px',
                  width: '350px',
                  height: '420px',
                  padding: '0',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}
                whileHover={{
                  y: -8,
                  borderColor: '#00f0ff',
                  boxShadow: '0 0 25px rgba(0, 240, 255, 0.35), 0 0 10px rgba(139, 92, 246, 0.2)'
                }}
              >
                {/* Visual Accent side line */}
                <div className="laser-sideline" />

                {/* Sweeping Shimmer light laser */}
                <div className="card-shimmer-sweep" />

                {/* Project Image Preview Cover */}
                <div style={{ width: '100%', height: '180px', overflow: 'hidden', position: 'relative', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <img 
                    src={getMediaUrl(project.projectImage)} 
                    alt={project.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Video Badge Overlay */}
                  {project.demoVideo && (
                    <span style={{
                      position: 'absolute',
                      top: '15px',
                      left: '15px',
                      backgroundColor: 'rgba(5, 8, 22, 0.85)',
                      border: '1px solid rgba(0, 255, 136, 0.3)',
                      color: '#00ff88',
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      letterSpacing: '1px',
                      boxShadow: '0 0 10px rgba(0, 255, 136, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Video size={10} style={{ fill: 'rgba(0, 255, 136, 0.3)' }} />
                      <span>DEMO VIDEO</span>
                    </span>
                  )}
                  {/* Class Badge Overlay */}
                  <span style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: 'rgba(5, 8, 22, 0.85)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    color: '#00f0ff',
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    letterSpacing: '1px',
                    boxShadow: '0 0 10px rgba(0, 240, 255, 0.1)'
                  }}>
                    {project.classSection}
                  </span>
                </div>

                {/* Card Information Body */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f3f4f6', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {project.title}
                  </h3>
                  
                  {/* Team Members Chips List */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {project.members.slice(0, 3).map((member: string, mIdx: number) => (
                      <span key={mIdx} style={{
                        fontSize: '0.65rem',
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: '#9ca3af',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {member}
                      </span>
                    ))}
                    {project.members.length > 3 && (
                      <span style={{ fontSize: '0.65rem', color: '#8b5cf6', fontWeight: 'bold' }}>+{project.members.length - 3} more</span>
                    )}
                  </div>

                  <p style={{ 
                    color: '#9ca3af', 
                    fontSize: '0.8rem', 
                    lineHeight: '1.5',
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    marginTop: '4px'
                  }}>
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ================= PROJECT SUBMISSION SYSTEM FORM ================= */}
        <div id="submission-form" style={{ maxWidth: '800px', margin: '0 auto', scrollMarginTop: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span 
              style={{ 
                fontFamily: "'Space Grotesk', sans-serif", 
                fontSize: '0.85rem', 
                color: '#8b5cf6', 
                letterSpacing: '3px',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '10px'
              }}
              className="text-glow-purple"
            >
              Add Showcase
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '0.5px' }}>
              Submit Your Project
            </h2>
            <div style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #8b5cf6, #00f0ff)', margin: '15px auto 0', borderRadius: '2px' }} />
          </div>

          {/* Glowing Glassmorphic Form Card */}
          <div 
            className="glass-panel submission-card"
          >
            {submitSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid #00ff88',
                  padding: '10px 24px',
                  borderRadius: '30px',
                  color: '#00ff88',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  zIndex: 20
                }}
              >
                <CheckCircle2 size={16} />
                <span>Project submitted and added in Showcase!</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Field 1: Title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: '#e5e7eb', fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                  PROJECT TITLE
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. EcoGreen Smart Greenhouse"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    color: '#fff',
                    fontFamily: "'Space Grotesk', sans-serif",
                    outline: 'none',
                    fontSize: '0.9rem',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00f0ff'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  required
                />
              </div>

              {/* Field 2: Dynamic Team Members List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <label style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: '#e5e7eb', fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                    TEAM MEMBERS (MINIMUM 2)
                  </label>
                  
                  <button
                    type="button"
                    onClick={handleAddMember}
                    onMouseEnter={playHover}
                    className="clickable"
                    style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      color: '#8b5cf6',
                      fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
                      fontFamily: "'Orbitron', sans-serif",
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)'}
                  >
                    <Plus size={12} />
                    <span>Add Member</span>
                  </button>
                </div>

                {/* Member Input items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {members.map((member, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                    >
                      <input 
                        type="text" 
                        value={member}
                        onChange={(e) => handleMemberChange(idx, e.target.value)}
                        placeholder={`Member Name #${idx + 1}`}
                        style={{
                          flex: 1,
                          backgroundColor: 'rgba(0,0,0,0.4)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '8px',
                          padding: '12px 18px',
                          color: '#fff',
                          fontFamily: "'Space Grotesk', sans-serif",
                          outline: 'none',
                          fontSize: '0.85rem',
                          transition: 'border-color 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                        onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                        required
                      />
                      {members.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          onMouseEnter={playHover}
                          className="clickable"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            backgroundColor: 'rgba(239, 68, 68, 0.05)',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Field 3: Universal ClassDropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: '#e5e7eb', fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                  CLASS & SECTION
                </label>
                <select
                  value={classSection}
                  onChange={(e) => setClassSection(e.target.value)}
                  style={{
                    backgroundColor: 'rgba(12, 17, 43, 0.95)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    color: '#fff',
                    fontFamily: "'Space Grotesk', sans-serif",
                    outline: 'none',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="I BCA A">I BCA A</option>
                  <option value="I BCA B">I BCA B</option>
                  <option value="I BCA C">I BCA C</option>
                  <option value="II BCA A">II BCA A</option>
                  <option value="II BCA B">II BCA B</option>
                  <option value="III BCA A">III BCA A</option>
                  <option value="III BCA B">III BCA B</option>
                </select>
              </div>

              {/* Field 4 & 5: File uploads grids */}
              <div className="file-uploads-grid">
                
                {/* Screenshot Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: '#e5e7eb', fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                    PROJECT IMAGE SCREENSHOT
                  </label>
                  
                  <label 
                    className="clickable"
                    style={{
                      border: '2px dashed rgba(0, 240, 255, 0.3)',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      padding: '24px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#00f0ff';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.03)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                    }}
                  >
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'image')}
                      style={{ display: 'none' }}
                      required
                    />
                    <Upload size={24} style={{ color: '#00f0ff' }} />
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif" }}>
                      {projectImage ? projectImage.name : 'Select website or IoT screenshot'}
                    </span>
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px', marginTop: '6px' }} />
                    )}
                  </label>
                </div>

                {/* Banner Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: '#e5e7eb', fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                    TECHNICAL BANNER / CHART
                  </label>
                  
                  <label 
                    className="clickable"
                    style={{
                      border: '2px dashed rgba(139, 92, 246, 0.3)',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      padding: '24px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#8b5cf6';
                      e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.03)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                    }}
                  >
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'banner')}
                      style={{ display: 'none' }}
                      required
                    />
                    <Upload size={24} style={{ color: '#8b5cf6' }} />
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif" }}>
                      {bannerChart ? bannerChart.name : 'Select architectural diagram/banner'}
                    </span>
                    {bannerPreview && (
                      <img src={bannerPreview} alt="Preview" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px', marginTop: '6px' }} />
                    )}
                  </label>
                </div>
              </div>

              {/* Field: Project Demo Video (Drag and Drop) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: '#e5e7eb', fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                  PROJECT DEMO VIDEO (REQUIRED)
                </label>
                
                <div 
                  className={`clickable ${isDraggingVideo ? 'border-glow-cyan' : ''}`}
                  style={{
                    border: isDraggingVideo ? '2px solid #00f0ff' : '2px dashed rgba(0, 240, 255, 0.3)',
                    backgroundColor: isDraggingVideo ? 'rgba(0, 240, 255, 0.05)' : 'rgba(0, 0, 0, 0.2)',
                    padding: '30px 24px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: isDraggingVideo ? '0 0 20px rgba(0, 240, 255, 0.2)' : 'none',
                    backdropFilter: 'blur(8px)',
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingVideo(true);
                  }}
                  onDragLeave={() => {
                    setIsDraggingVideo(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingVideo(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleVideoFile(file);
                  }}
                  onClick={() => {
                    document.getElementById('video-file-input')?.click();
                  }}
                  onMouseOver={(e) => {
                    if (!isDraggingVideo) {
                      e.currentTarget.style.borderColor = '#00f0ff';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.03)';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.1)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isDraggingVideo) {
                      e.currentTarget.style.borderColor = 'rgba(0, 240, 255, 0.3)';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <input 
                    id="video-file-input"
                    type="file" 
                    accept=".mp4,.mov,.avi,.webm,.mkv"
                    onChange={(e) => handleFileChange(e, 'video')}
                    style={{ display: 'none' }}
                  />

                  {videoPreview ? (
                    <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0, 240, 255, 0.3)', boxShadow: '0 0 15px rgba(0, 240, 255, 0.1)' }}>
                        <video 
                          src={videoPreview} 
                          controls 
                          style={{ width: '100%', maxHeight: '200px', display: 'block', backgroundColor: '#000' }} 
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDemoVideo(null);
                            setVideoPreview(null);
                            const videoInput = document.getElementById('video-file-input') as HTMLInputElement | null;
                            if (videoInput) {
                              videoInput.value = '';
                            }
                          }}
                          onMouseEnter={playHover}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            backgroundColor: 'rgba(239, 68, 68, 0.85)',
                            color: '#fff',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            fontFamily: "'Orbitron', sans-serif",
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.85)'}
                        >
                          REMOVE
                        </button>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#00f0ff', fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>
                        Selected: {demoVideo?.name} ({( (demoVideo?.size || 0) / (1024 * 1024) ).toFixed(2)} MB)
                      </span>
                    </div>
                  ) : (
                    <>
                      <Video size={36} className="animate-flicker" style={{ color: '#00f0ff', filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                          Drag & Drop video file here, or click to browse
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif", maxWidth: '500px', margin: '0 auto', lineHeight: '1.4' }}>
                          Upload a demo video of your website, AI model, IoT project, software application, or technical innovation.
                        </span>
                      </div>
                    </>
                  )}
                </div>
                
                <span style={{ fontSize: '0.7rem', color: '#8b5cf6', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.5px' }}>
                  Show your project's working functionality, interface, features, hardware setup, workflow, or live demonstration.
                </span>
              </div>

              {/* Field 6: Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: '#e5e7eb', fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                  SHORT PROJECT DESCRIPTION
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the project objectives, technologies and key outputs..."
                  rows={4}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '14px 18px',
                    color: '#fff',
                    fontFamily: "'Space Grotesk', sans-serif",
                    outline: 'none',
                    fontSize: '0.9rem',
                    resize: 'none',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#00f0ff'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                  required
                />
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#00f0ff', fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px' }}>
                      TRANSMITTING PROJECT PACKAGE...
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#00f0ff', fontWeight: 700, fontFamily: "'Orbitron', sans-serif" }}>
                      {uploadProgress}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,240,255,0.2)' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.1 }}
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #00f0ff, #8b5cf6)',
                        boxShadow: '0 0 10px #00f0ff',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Submit trigger button */}
              <button
                type="submit"
                disabled={isSubmitting}
                onMouseEnter={playHover}
                className="clickable"
                style={{
                  padding: '16px 36px',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  color: '#050816',
                  background: 'linear-gradient(90deg, #00f0ff, #8b5cf6)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  letterSpacing: '2px',
                  boxShadow: '0 0 25px rgba(0, 240, 255, 0.35)',
                  transition: 'all 0.3s ease',
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 0 35px rgba(139, 92, 246, 0.5)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.35)';
                }}
              >
                <Sparkles size={16} />
                <span>{isSubmitting ? 'SAVING TO DATABASE...' : 'PUBLISH PROJECT'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ================= EXPANDABLE CHANNELS DETAILS MODAL ================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              data-lenis-prevent
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDetails}
            >
              <motion.div
                className="glass-panel details-modal-card"
                data-lenis-prevent
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="scanline-overlay" />

                {/* Close Trigger Button */}
                <button
                  onClick={closeDetails}
                  onMouseEnter={playHover}
                  className="clickable"
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.9rem',
                    zIndex: 30,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderColor = '#00f0ff';
                    e.currentTarget.style.boxShadow = '0 0 10px #00f0ff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ✕
                </button>

                {/* Class indicator badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#00f0ff', 
                    fontWeight: 700, 
                    fontFamily: "'Orbitron', sans-serif",
                    letterSpacing: '1px',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(0, 240, 255, 0.05)'
                  }}>
                    {selectedProject.classSection}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontFamily: "'Space Grotesk', sans-serif" }}>
                    BCA Project Showcase
                  </span>
                </div>

                {/* Title */}
                <h2 style={{ fontSize: '2rem', color: '#fff', fontWeight: 900, marginBottom: '15px', letterSpacing: '0.5px' }}>
                  {selectedProject.title}
                </h2>

                {/* Members listing */}
                <div style={{ marginBottom: '25px' }}>
                  <h4 style={{ fontSize: '0.75rem', color: '#8b5cf6', letterSpacing: '1px', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                    PROJECT DEVELOPERS
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedProject.members.map((member: string, idx: number) => (
                      <span key={idx} style={{
                        fontSize: '0.8rem',
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: '#f3f4f6',
                        backgroundColor: 'rgba(139, 92, 246, 0.08)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        padding: '4px 12px',
                        borderRadius: '6px'
                      }}>
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '30px' }}>
                  <p>{selectedProject.description}</p>
                </div>

                {/* Demo Video Player */}
                {selectedProject.demoVideo && (
                  <div style={{ marginBottom: '30px' }}>
                    <h4 style={{ fontSize: '0.75rem', color: '#00f0ff', letterSpacing: '1.5px', marginBottom: '12px', fontFamily: "'Orbitron', sans-serif" }} className="text-glow-cyan">
                      PROJECT DEMO VIDEO
                    </h4>
                    <div 
                      className="glass-panel"
                      style={{ 
                        width: '100%', 
                        borderRadius: '12px', 
                        overflow: 'hidden', 
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                        boxShadow: '0 0 25px rgba(0, 240, 255, 0.15)',
                        backgroundColor: '#000',
                        position: 'relative'
                      }}
                    >
                      <video 
                        src={getMediaUrl(selectedProject.demoVideo)} 
                        controls 
                        playsInline
                        preload="metadata"
                        style={{ 
                          width: '100%', 
                          maxHeight: '400px',
                          display: 'block',
                          objectFit: 'contain',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Image Previews */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.75rem', color: '#8b5cf6', letterSpacing: '1px', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                      WEBSITE / PROJECT SCREENSHOT
                    </h4>
                    <div style={{ width: '100%', height: '240px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <img 
                        src={getMediaUrl(selectedProject.projectImage)} 
                        alt="Project Screenshot" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.75rem', color: '#8b5cf6', letterSpacing: '1px', marginBottom: '10px', fontFamily: "'Orbitron', sans-serif" }}>
                      TECHNICAL DIAGRAM / BANNER CHART
                    </h4>
                    <div style={{ width: '100%', height: '240px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <img 
                        src={getMediaUrl(selectedProject.bannerChart)} 
                        alt="Project Banner Chart" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ================= PROJECT SUBMISSION SUCCESS MODAL ================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {newlySubmittedProject && (
            <motion.div
              className="success-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="glass-panel success-modal-card"
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                transition={{ type: 'spring', damping: 20, stiffness: 180 }}
              >
                {/* Scanline Overlay */}
                <div className="scanline-overlay" style={{ opacity: 0.08 }} />
                
                {/* Holographic Glowing Sphere & Success Check */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 255, 136, 0.2) 0%, rgba(0, 255, 136, 0.05) 70%, transparent 100%)',
                    border: '3px solid #00ff88',
                    boxShadow: '0 0 30px rgba(0, 255, 136, 0.4), inset 0 0 15px rgba(0, 255, 136, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 25px',
                    position: 'relative'
                  }}
                >
                  <CheckCircle2 size={44} style={{ color: '#00ff88', filter: 'drop-shadow(0 0 8px #00ff88)' }} />
                  
                  {/* Outer animated ring */}
                  <motion.span
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    style={{
                      position: 'absolute',
                      width: '110px',
                      height: '110px',
                      border: '1px solid rgba(0, 255, 136, 0.5)',
                      borderRadius: '50%'
                    }}
                  />
                </motion.div>

                <h3 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: '#fff',
                  marginBottom: '15px',
                  letterSpacing: '2px',
                  background: 'linear-gradient(90deg, #00ff88, #00f0ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 5px rgba(0, 255, 136, 0.1))'
                }}>
                  TRANSMISSION SUCCESSFUL
                </h3>
                
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.9rem',
                  color: '#9ca3af',
                  marginBottom: '30px',
                  lineHeight: '1.6'
                }}>
                  Your project has been successfully uploaded to the exhibition mainframe. It is now live in the global Showcase directory!
                </p>

                {/* Summary Box */}
                <div 
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'left',
                    marginBottom: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#00f0ff', fontFamily: "'Orbitron', sans-serif", display: 'block', marginBottom: '4px', letterSpacing: '1px' }}>
                      PROJECT TITLE
                    </span>
                    <span style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 'bold' }}>
                      {newlySubmittedProject.title}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#8b5cf6', fontFamily: "'Orbitron', sans-serif", display: 'block', marginBottom: '4px', letterSpacing: '1px' }}>
                        CLASS & SECTION
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#d1d5db' }}>
                        {newlySubmittedProject.classSection}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#8b5cf6', fontFamily: "'Orbitron', sans-serif", display: 'block', marginBottom: '4px', letterSpacing: '1px' }}>
                        TEAM SIZE
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#d1d5db' }}>
                        {newlySubmittedProject.members?.length || 0} Members
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      playClick();
                      setNewlySubmittedProject(null);
                      document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onMouseEnter={playHover}
                    className="clickable"
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: '#050816',
                      backgroundColor: '#00ff88',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      letterSpacing: '1px',
                      boxShadow: '0 0 15px rgba(0, 255, 136, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#00ffaa';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#00ff88';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.3)';
                    }}
                  >
                    VIEW SHOWCASE
                  </button>
                  
                  <button
                    onClick={() => {
                      playClick();
                      setNewlySubmittedProject(null);
                    }}
                    onMouseEnter={playHover}
                    className="clickable"
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      fontFamily: "'Orbitron', sans-serif",
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: '#fff',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      letterSpacing: '1px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#00f0ff';
                      e.currentTarget.style.backgroundColor = 'rgba(0, 240, 255, 0.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    CLOSE
                  </button>
                </div>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};
