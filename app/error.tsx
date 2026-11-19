"use client";
import StatusPage from "./component/StatusPage";

export default function Error() {
  return (
    <StatusPage
      badgeClassName="bg-red-500"
      badgeIcon={
        <>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </>
      }
      heading="Oops!"
      headingClassName="text-4xl md:text-6xl from-red-500 to-orange-500"
      title="Something Went Wrong"
      message="Don't worry! Even the best quiz masters stumble sometimes. Let's get you back to the quiz action where everything works perfectly."
      cards={[
        {
          title: "Temporary Issue",
          text: "This is likely a temporary glitch",
          iconClassName: "bg-red-500",
          icon: (
            <>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </>
          ),
        },
        {
          title: "Quick Recovery",
          text: "A refresh usually fixes most issues",
          iconClassName: "bg-emerald-500",
          icon: (
            <>
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </>
          ),
        },
        {
          title: "We're On It",
          text: "Our team monitors all issues closely",
          iconClassName: "bg-blue-500",
          icon: (
            <>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </>
          ),
        },
      ]}
      actionLabel="Return to Home"
    />
  );
}
