"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Copy, UploadCloud, CreditCard, PlayCircle, CheckCircle, AlertCircle } from "lucide-react";

interface Course {
  id: string;
  title: string;
  bannerUrl: string;
  price: number;
}

const CoursePurchaseModal = ({ course, onClose }: { course: Course; onClose: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });
  const [proofFile, setProofFile] = useState<File | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!proofFile) {
        setErrorMessage("Payment receipt must be uploaded.");
        return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("courseId", course.id);
      data.append("customerName", formData.customerName);
      data.append("customerEmail", formData.customerEmail);
      data.append("customerPhone", formData.customerPhone);
      data.append("paymentProofUrl", proofFile);

      // Kita fetch ke API backend langsung
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/course-purchase`, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      setIsSuccess(true);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "An error occurred while uploading the payment receipt. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText("0223320225");
    alert("Account number copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md p-4 pt-20 transition-all duration-300">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform scale-100 transition-transform duration-300 relative border border-gray-100">
        
        {isSuccess ? (
          <div className="p-10 md:p-14 text-center flex flex-col items-center">
             <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <CheckCircle className="w-12 h-12 text-green-500" />
             </div>
             <h3 className="text-3xl font-extrabold text-gray-900 mb-4 font-heading">Payment Successful!</h3>
             <p className="text-gray-600 text-lg mb-10 max-w-sm leading-relaxed">
               Your transfer receipt has been received. Our admin will verify it shortly and contact you via Email/WhatsApp for class access.
             </p>
             <Button size="lg" onClick={onClose} className="w-full max-w-sm font-bold py-6 text-lg rounded-xl shadow-lg shadow-primary/20">
               Close & Return to Course
             </Button>
          </div>
        ) : (
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 font-heading">Course Purchase</h3>
              <p className="text-gray-500 mt-1">Complete your payment to access exclusive materials.</p>
            </div>
            <button onClick={onClose} className="bg-gray-100 hover:bg-red-100 hover:text-primary text-gray-500 p-2 rounded-full transition-colors flex-shrink-0">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className="mb-8 flex flex-col md:flex-row gap-6 bg-gradient-to-br from-red-50 to-white border border-red-100 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10" />
            <div className="flex-1 z-10">
              <p className="text-primary font-bold text-sm tracking-wider uppercase mb-2 flex items-center gap-2"><PlayCircle className="w-4 h-4"/> SELECTED COURSE</p>
              <p className="font-semibold text-gray-800 text-xl leading-snug mb-3">{course.title}</p>
              <div className="inline-block bg-primary/10 text-primary font-bold text-xl px-4 py-2 rounded-xl shadow-sm border border-primary/20">
                 Rp {new Intl.NumberFormat('id-ID').format(course.price)}
              </div>
            </div>
          </div>

          <div className="mb-8 relative">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-gray-500"/> Bank Account Information</h4>
            <div className="bg-gray-50 p-6 border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="font-extrabold text-2xl text-[#005E6A]">BCA</div>
                  <div className="text-2xl font-black text-gray-900 tracking-wider">0223320225</div>
                </div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">A.N PT. NIAGA TEKNO ASIA</p>
              </div>
              <button onClick={copyToClipboard} type="button" className="flex items-center gap-2 text-sm font-semibold text-primary bg-red-50 hover:bg-red-100 px-4 py-2 rounded-full transition-colors border border-red-100">
                <Copy className="w-4 h-4" /> Copy Acc. Number
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white outline-none transition-all text-gray-800 font-medium"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Number</label>
                <input 
                  type="text" 
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white outline-none transition-all text-gray-800 font-medium"
                  placeholder="081234567890"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email (For Access Delivery)</label>
              <input 
                type="email" 
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary focus:bg-white outline-none transition-all text-gray-800 font-medium"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload Payment Receipt</label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full px-5 py-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${proofFile ? 'border-primary bg-red-50' : 'border-gray-300 bg-gray-50 group-hover:bg-gray-100 group-hover:border-gray-400'}`}>
                   {proofFile ? (
                      <p className="font-semibold text-primary break-all text-center">{proofFile.name}</p>
                   ) : (
                      <>
                        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-600 font-medium text-sm text-center"><span className="text-primary font-bold">Click to upload</span> or drag & drop</p>
                        <p className="text-gray-400 text-xs mt-1">PNG, JPG, JPEG (Max 10MB)</p>
                      </>
                   )}
                </div>
              </div>
            </div>
            
            <div className="pt-4 pb-2">
              {errorMessage && (
                <div className="mb-4 flex items-start gap-2 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">{errorMessage}</p>
                </div>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                size="lg"
                className={`w-full py-6 rounded-xl font-bold text-lg ${isSubmitting ? 'opacity-70' : 'shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-1'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Payment'}
              </Button>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
}


export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/course`);
        setCourses(response.data.data);
      } catch {
        console.error("Failed to fetch courses");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return <div className="min-h-[50vh] flex justify-center items-center">Loading courses...</div>;
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2 hidden md:block"></div>
      
      <div className="w-full md:max-w-7xl mx-auto px-5 md:px-10 pb-24 relative z-10">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-primary font-bold tracking-widest text-sm uppercase mb-3 block">Level Up Your Skills</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-gray-900 leading-tight">
             Exclusive <span className="text-primary">Masterclass</span> <br/>Video Course
          </h2>
          <p className="mt-6 text-gray-600 text-lg md:text-xl">
            Boost your revenue and digital business skills with practical, proven materials.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          {courses.map((course) => (
            <div key={course.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-gray-100 flex flex-col h-full transform hover:-translate-y-2">
              <div className="w-full aspect-square relative bg-gray-50 overflow-hidden" onClick={() => setSelectedCourse(course)}>
                {course.bannerUrl ? (
                  <Image 
                    src={`${process.env.NEXT_PUBLIC_BASE_URL_FILE}${course.bannerUrl}`} 
                    alt={course.title} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center bg-gray-100">
                    <PlayCircle className="w-12 h-12 mb-3 opacity-50" />
                    <span className="font-semibold">{course.title}</span>
                  </div>
                )}
                {/* Badge Overlay */}
                <div className="absolute top-4 left-4 z-10 transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                  <span className="inline-block px-3 py-1 bg-red-50 text-primary text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">Premium Course</span>
                </div>
                {/* Overlay gradient on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 cursor-pointer">
                  <p className="text-white font-bold flex items-center gap-2"><PlayCircle className="w-5 h-5"/> Preview Material</p>
                </div>
              </div>
              
              <div className="p-5 md:p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  <h3 className="font-semibold text-[1.1rem] md:text-xl text-gray-800 leading-snug line-clamp-2" title={course.title}>
                    {course.title}
                  </h3>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-4">
                   <div className="flex flex-col">
                      <span className="text-[1.35rem] font-bold text-primary">
                         Rp {formatRupiah(course.price)}
                      </span>
                   </div>
                  <Button 
                    onClick={() => setSelectedCourse(course)}
                    size="normal"
                    className="w-full font-bold text-lg py-6 shadow-md shadow-primary/20 group-hover:shadow-primary/40 rounded-xl"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
               <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <PlayCircle className="w-10 h-10 text-gray-400" />
               </div>
               <h3 className="text-2xl font-bold text-gray-800 mb-2">No courses available yet</h3>
               <p className="text-gray-500 md:text-lg">Stay tuned for our upcoming amazing materials.</p>
            </div>
          )}
        </div>

        {selectedCourse && (
          <CoursePurchaseModal 
            course={selectedCourse} 
            onClose={() => setSelectedCourse(null)} 
          />
        )}
      </div>
    </section>
  );
}
