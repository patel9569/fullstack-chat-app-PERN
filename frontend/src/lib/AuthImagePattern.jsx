import { MdChatBubbleOutline, MdGroup, MdCall, MdAttachFile, MdSettings, MdEmojiEmotions, MdNotifications, MdContacts, MdLock } from "react-icons/md";

const icons = [
  MdChatBubbleOutline,
  MdGroup,
  MdCall,
  MdAttachFile,
  MdSettings,
  MdEmojiEmotions,
  MdNotifications,
  MdContacts,
  MdLock
];

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {icons.map((Icon, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 flex items-center justify-center transition-transform duration-300 ease-in-out transform hover:scale-110 ${
                i % 2 === 0 ? "animate-pulse" : ""
              }`}
            >
              <Icon size={28} className="text-primary" />
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
