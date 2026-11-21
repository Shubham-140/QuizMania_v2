import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import StatusPage from "./component/StatusPage";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <StatusPage
        badgeClassName="bg-emerald-500"
        badgeIcon={
          <>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </>
        }
        heading="404"
        headingClassName="text-6xl md:text-8xl from-emerald-500 to-blue-500"
        title="Quiz Not Found!"
        message="Looks like this page took a wrong turn in the quiz maze. Don't worry though - there are plenty more quizzes waiting for you back at home!"
        cards={[
          {
            title: "Go Home",
            text: "Start fresh with our quiz selection",
            iconClassName: "bg-emerald-500",
            icon: (
              <>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </>
            ),
          },
          {
            title: "Browse Quizzes",
            text: "Explore our quiz categories",
            iconClassName: "bg-emerald-500",
            icon: (
              <>
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </>
            ),
          },
          {
            title: "Random Quiz",
            text: "Try a surprise challenge",
            iconClassName: "bg-emerald-500",
            icon: (
              <>
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </>
            ),
          },
        ]}
        actionLabel="Back to Home"
      />
      <Footer />
    </>
  );
}
