"use client";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { generateGPSReport } from "@/lib/matching";
import type { UserProfile } from "@/types";
import Step0Welcome from "./steps/Step0Welcome";
import Step1Personal from "./steps/Step1Personal";
import Step2Education from "./steps/Step2Education";
import Step3Skills from "./steps/Step3Skills";
import Step4Interests from "./steps/Step4Interests";
import Step5WorkStyle from "./steps/Step5WorkStyle";
import Step6Values from "./steps/Step6Values";
import Step7Comfort from "./steps/Step7Comfort";
import Step8Preferences from "./steps/Step8Preferences";
import Step9Careers from "./steps/Step9Careers";
import ProgressBar from "./ProgressBar";

const TOTAL_STEPS = 10;

export default function QuizShell() {
  const { step, profile, nextStep, prevStep, setReport } = useQuizStore();
  const router = useRouter();

  const handleFinish = () => {
    const report = generateGPSReport(profile as UserProfile);
    setReport(report);
    router.push("/report");
  };

  const progress = Math.round((step / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="min-h-screen gradient-hero py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {step > 0 && (
          <div className="mb-6">
            <ProgressBar progress={progress} step={step} total={TOTAL_STEPS - 1} />
          </div>
        )}

        <div className="animate-fadeIn">
          {step === 0 && <Step0Welcome onStart={nextStep} />}
          {step === 1 && <Step1Personal onNext={nextStep} onBack={prevStep} />}
          {step === 2 && <Step2Education onNext={nextStep} onBack={prevStep} />}
          {step === 3 && <Step3Skills onNext={nextStep} onBack={prevStep} />}
          {step === 4 && <Step4Interests onNext={nextStep} onBack={prevStep} />}
          {step === 5 && <Step5WorkStyle onNext={nextStep} onBack={prevStep} />}
          {step === 6 && <Step6Values onNext={nextStep} onBack={prevStep} />}
          {step === 7 && <Step7Comfort onNext={nextStep} onBack={prevStep} />}
          {step === 8 && <Step8Preferences onNext={nextStep} onBack={prevStep} />}
          {step === 9 && <Step9Careers onNext={handleFinish} onBack={prevStep} />}
        </div>
      </div>
    </div>
  );
}
