import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HomePage from "./pages/HomePage";
import CalculatorPage from "./pages/CalculatorPage";
import InvestmentsPage from "./pages/InvestmentsPage";
import ExpensesPage from "./pages/ExpensesPage";
import MutualFundsPage from "./pages/MutualFundsPage";
import NotFound from "./pages/NotFound";
import AuthProvider from "@/components/auth/AuthProvider";
import { PlannerSessionProvider } from '@/components/calculator/PlannerSession';
import FinanceGuide from './components/calculator/FinanceGuide';
import FixedDepositsPage from './pages/FixedDepositsPage';
import TermInsurancePage from './pages/TermInsurancePage';
import SipCalculatorPage from './pages/SipCalculatorPage';
import CalculatorsPage, { FdCalculatorPage, NpsCalculatorPage, InvestmentCalculatorPage } from './pages/CalculatorsPage';
import InteractiveDemoPage from './pages/InteractiveDemoPage';
import PublicHeader from './components/PublicHeader';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes><Route path="/demo" element={<InteractiveDemoPage />} /><Route path="/calculators" element={<CalculatorsPage />} /><Route path="/fd-calculator" element={<FdCalculatorPage />} /><Route path="/sip-calculator" element={<SipCalculatorPage />} /><Route path="/nps-calculator" element={<NpsCalculatorPage />} /><Route path="/investment-calculator" element={<InvestmentCalculatorPage />} /><Route path="/investments" element={<><PublicHeader activeHref="/investments" /><InvestmentsPage /></>} /><Route path="/expenses" element={<><PublicHeader activeHref="/expenses" /><ExpensesPage /></>} /><Route path="/*" element={
        <AuthProvider>
        <PlannerSessionProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/mutual-funds" element={<MutualFundsPage />} />
          <Route path="/fixed-deposits" element={<FixedDepositsPage />} />
          <Route path="/term-insurance" element={<TermInsurancePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FinanceGuide />
        </PlannerSessionProvider>
        </AuthProvider>
        } /></Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
