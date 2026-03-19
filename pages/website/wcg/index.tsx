import Head from "next/head";
import { useState } from "react";
import { Roboto, Open_Sans, Lato, Noto_Sans_TC, Noto_Sans_JP, Inter } from "next/font/google";

import FloatingCard from "@/components/website/wcg/floating-card";
import Header from "@/components/website/wcg/header";
import Hero from "@/components/website/wcg/hero";
import Comparison from "@/components/website/wcg/comparison";
import KeyConcepts from "@/components/website/wcg/key-concepts";
import AccountTypes from "@/components/website/wcg/account-types";
import Market from "@/components/website/wcg/market";
import MarketUrgency from "@/components/website/wcg/market-urgency";
import Features from "@/components/website/wcg/features";
import PromotionalBanner from "@/components/website/wcg/promotional-banner";
import Award from "@/components/website/wcg/award";
import ComparisonTable from "@/components/website/wcg/comparison-table";
import Steps from "@/components/website/wcg/steps";
import PlatformComparison from "@/components/website/wcg/platform-comparison";
import FollowSmartMoney from "@/components/website/wcg/follow-smart-money";
import MarketTrendBanner from "@/components/website/wcg/market-trend-banner";
import FAQ from "@/components/website/wcg/faq";
import FinalCTA from "@/components/website/wcg/final-cta";

const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700", "900"],
});

const openSans = Open_Sans({
    variable: "--font-open-sans",
    subsets: ["latin"],
    weight: ["400", "600", "700"],
});

const lato = Lato({
    variable: "--font-lato",
    subsets: ["latin"],
    weight: ["400", "700"],
});

const notoSansTC = Noto_Sans_TC({
    variable: "--font-noto-sans-tc",
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "900"],
});

const notoSansJP = Noto_Sans_JP({
    variable: "--font-noto-sans-jp",
    subsets: ["latin"],
    weight: ["400", "500", "700"],
});

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default function WCGPage() {
    const [activeConcept, setActiveConcept] = useState(2);

    return (
        <>
            <Head>
                <title>WCG Markets | 專業外匯交易平台</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className={`${roboto.variable} ${openSans.variable} ${lato.variable} ${notoSansTC.variable} ${notoSansJP.variable} ${inter.variable} min-h-screen`}>
                <FloatingCard />
                <Header />
                <Hero />
                <Comparison />
                <KeyConcepts activeConcept={activeConcept} setActiveConcept={setActiveConcept} />
                <AccountTypes />
                <Market />
                <MarketUrgency />
                <Features />
                <PromotionalBanner />
                <Award />
                <ComparisonTable />
                <Steps />
                <PlatformComparison />
                <FollowSmartMoney />
                <MarketTrendBanner />
                <FAQ />
                <FinalCTA />
                {/* <Footer /> */}
            </div>
        </>
    );
}
