import React from "react";

const ShareSocmedButton = ({ title, slug }: { title: string; slug: string }) => {
  const shareUrl = `${process.env.NEXT_PUBLIC_DOMAIN_URL}/insights/${slug}`;
  const shareText = title;

  return (
    <div className="flex items-center gap-3">
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button><svg
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.3132 2.75H15.6135L10.5885 8.46875L16.5 16.25H11.871L8.24625 11.5302L4.098 16.25H1.7955L7.17075 10.1337L1.5 2.75H6.246L9.5235 7.064L13.3132 2.75ZM12.5062 14.879H13.7812L5.553 4.049H4.185L12.5062 14.879Z"
            fill="#1D1D1D"
            fillOpacity="0.5"
          />
        </svg></button>
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button><svg
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5 9.5C16.5 5.36 13.14 2 9 2C4.86 2 1.5 5.36 1.5 9.5C1.5 13.13 4.08 16.1525 7.5 16.85V11.75H6V9.5H7.5V7.625C7.5 6.1775 8.6775 5 10.125 5H12V7.25H10.5C10.0875 7.25 9.75 7.5875 9.75 8V9.5H12V11.75H9.75V16.9625C13.5375 16.5875 16.5 13.3925 16.5 9.5Z"
            fill="#1D1D1D"
            fillOpacity="0.5"
          />
        </svg></button>
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
          shareUrl
        )}&title=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button><svg
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.25 2.75C14.6478 2.75 15.0294 2.90804 15.3107 3.18934C15.592 3.47064 15.75 3.85218 15.75 4.25V14.75C15.75 15.1478 15.592 15.5294 15.3107 15.8107C15.0294 16.092 14.6478 16.25 14.25 16.25H3.75C3.35218 16.25 2.97064 16.092 2.68934 15.8107C2.40804 15.5294 2.25 15.1478 2.25 14.75V4.25C2.25 3.85218 2.40804 3.47064 2.68934 3.18934C2.97064 2.90804 3.35218 2.75 3.75 2.75H14.25ZM13.875 14.375V10.4C13.875 9.75155 13.6174 9.12965 13.1589 8.67112C12.7003 8.2126 12.0785 7.955 11.43 7.955C10.7925 7.955 10.05 8.345 9.69 8.93V8.0975H7.5975V14.375H9.69V10.6775C9.69 10.1 10.155 9.6275 10.7325 9.6275C11.011 9.6275 11.278 9.73812 11.475 9.93504C11.6719 10.132 11.7825 10.399 11.7825 10.6775V14.375H13.875ZM5.16 6.92C5.49417 6.92 5.81466 6.78725 6.05095 6.55095C6.28725 6.31466 6.42 5.99417 6.42 5.66C6.42 4.9625 5.8575 4.3925 5.16 4.3925C4.82384 4.3925 4.50144 4.52604 4.26374 4.76374C4.02604 5.00144 3.8925 5.32384 3.8925 5.66C3.8925 6.3575 4.4625 6.92 5.16 6.92ZM6.2025 14.375V8.0975H4.125V14.375H6.2025Z"
            fill="#1D1D1D"
            fillOpacity="0.5"
          />
        </svg></button>
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(
          `${shareText} ${shareUrl}`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button><svg
          width="18"
          height="19"
          viewBox="0 0 18 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.25 13.25H5.25C4.2125 13.25 3.32825 12.8842 2.59725 12.1528C1.86625 11.4212 1.5005 10.537 1.5 9.5C1.4995 8.463 1.86525 7.57875 2.59725 6.84725C3.32925 6.11575 4.2135 5.75 5.25 5.75H8.25V7.25H5.25C4.625 7.25 4.09375 7.46875 3.65625 7.90625C3.21875 8.34375 3 8.875 3 9.5C3 10.125 3.21875 10.6562 3.65625 11.0938C4.09375 11.5312 4.625 11.75 5.25 11.75H8.25V13.25ZM6 10.25V8.75H12V10.25H6ZM9.75 13.25V11.75H12.75C13.375 11.75 13.9062 11.5312 14.3438 11.0938C14.7812 10.6562 15 10.125 15 9.5C15 8.875 14.7812 8.34375 14.3438 7.90625C13.9062 7.46875 13.375 7.25 12.75 7.25H9.75V5.75H12.75C13.7875 5.75 14.672 6.11575 15.4035 6.84725C16.135 7.57875 16.5005 8.463 16.5 9.5C16.4995 10.537 16.1338 11.4215 15.4028 12.1535C14.6718 12.8855 13.7875 13.251 12.75 13.25H9.75Z"
            fill="#1D1D1D"
            fillOpacity="0.5"
          />
        </svg></button>
      </a>
    </div>
  );
};

export default ShareSocmedButton;
