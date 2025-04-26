import { countryCode, Country } from '@/constants/countryCodes';
import Image from 'next/image';
import { JSX, useState, useEffect, FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import ThanksModal from '@/components/layouts/Dialog/ThanksModal';

export default function ContactForm(): JSX.Element {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const userCountryCode = data.country_code;

        const country = countryCode.find((c) => c.code === userCountryCode);
        setSelectedCountry(country || null);
      } catch (error) {
        console.error('Error fetching user country:', error);
      }
    };

    fetchUserCountry();
  }, []);

  useEffect(() => {
    if (selectedCountry && selectedCountry.dialCodes && selectedCountry.dialCodes.length > 0) {
      setPhoneNumber(selectedCountry.dialCodes[0]);
    }
  }, [selectedCountry]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = countryCode.find((c) => c.code === e.target.value);
    setSelectedCountry(country || null);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhoneNumber('');
    setInterest('');
    setMessage('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // console.log({ name }, { email }, { interest }, { message }, { phoneNumber })


    const dataForSpreadsheet = {
      "sheetName": "Contact Us",
      "Full Name": name,
      "Email": email,
      "Phone Number": phoneNumber.replace('+', ''),
      "Interest": interest,
      "Message": message
    }
    const web = (process.env.NEXT_PUBLIC_SPREADSHEET_API)?.toString() || ""

    try {
      const response = await axios.post(web, new URLSearchParams(dataForSpreadsheet), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      setIsSuccess(true);
      console.log(`Process is ${response.data.result}, to add row ${response.data.row} in sheet ${response.data.data}`);
    } catch (error: any) {
      console.log(error)
      console.error(`Process is ${error.result}, with message :  ${error.error}`);
    } finally {
      setIsSubmitting(false);
      resetForm();
    }
  };

  useEffect(() => {
    if (isSubmitting) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isSubmitting]);


  return (
    <>
      <ThanksModal open={isSuccess} setOpen={setIsSuccess} />
      {isSubmitting &&
        <div className="bg-black/20 fixed inset-0 flex justify-center items-center overflow-hidden z-[400]">
          <p className="text-white font-bold text-2xl text-center">Loading...</p>
        </div>
      }
      <form onSubmit={handleSubmit} action="" className="flex flex-col gap-y-6 w-full max-w-[47rem]">
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <input type="text" placeholder="Your Name" className="p-4 rounded-xl border border-[#909396] w-full text-sm lg:text-lg" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email Address" className="p-4 rounded-xl border border-[#909396] w-full text-sm lg:text-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <div className="flex w-full">
            <div className="relative">
              <select value={selectedCountry?.code || ''} onChange={handleCountryChange} className="appearance-none w-20 h-full p-4 pl-16 rounded-l-xl border border-r-0 border-[#909396] text-black bg-white z-10">
                <option value="" className="text-black">
                  Select
                </option>
                {countryCode.map((country) => (
                  <option key={country.code} value={country.code} className="text-black">
                    {country.name}
                  </option>
                ))}
              </select>
              {selectedCountry && (
                <div className="absolute inset-y-0 left-0 w-full flex items-center justify-center pointer-events-none">
                  <Image src={selectedCountry.image} alt={`${selectedCountry.name} flag`} width={24} height={18} className="object-cover" />
                </div>
              )}
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="w-px bg-[#909396]"></div>
            <input type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} placeholder={phoneNumber} className="p-4 rounded-r-xl border border-l-0 border-[#909396] w-full lg:w-[17.6rem] text-sm lg:text-lg" />
          </div>
          <input type="text" placeholder="I'm Interested in ..." className="p-4 rounded-xl border border-[#909396] w-full text-sm lg:text-lg" value={interest} onChange={(e) => setInterest(e.target.value)} />
        </div>
        <textarea placeholder="How can we help?" className="p-4 rounded-xl border border-[#909396] w-full text-sm lg:text-lg" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
        <button type="submit" className="py-4 px-14 rounded-full bg-primary text-white font-semibold text-sm lg:text-lg self-center hover:text-primary hover:bg-light border border-primary transition-colors duration-300" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send your message'}
        </button>
      </form>

      {/* <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold mb-4 font-heading capitalize">thank you</DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <p className="text-lg">Your message has been sent.</p>
            <p className="text-lg">Our team will contact you shortly</p>
          </div>
          <Button onClick={() => setShowSuccessModal(false)} className="mt-4 bg-primary text-white hover:bg-primary/90">
            OK
          </Button>
        </DialogContent>
      </Dialog> */}
    </>
  );
}
