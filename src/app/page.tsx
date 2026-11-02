import Banner from "@/components/Banner";
import NewArrivals from "@/components/NewArrivals";
import HowBorrowingWorks from "@/components/HowBorrowingWorks";
import ReaderReviews from "@/components/ReaderReviews";

export default function Home() {
  return (
    <div>
      <Banner />
      {/* [NEW SECTION]: Banner এর ঠিক পরে New Arrivals ডায়নামিক সেকশন */}
      <NewArrivals />
      <HowBorrowingWorks />
      <ReaderReviews />
    </div>
  );
}
