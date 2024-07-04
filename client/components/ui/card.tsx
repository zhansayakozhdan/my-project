import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  title: string;
  location: string;
  thumbnail: string;
  url: string;
  prize: string;
}

const Card: React.FC<CardProps> = ({ title, location, thumbnail, url, prize }) => {
  // Ensure the thumbnail URL starts with http:// or https://
  const absoluteThumbnailUrl = thumbnail.startsWith('//') ? `https:${thumbnail}` : thumbnail;

  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden">
      <Image src={absoluteThumbnailUrl} alt={title} width={300} height={200} className="w-full h-40 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-gray-500">{location}</p>
        <p className="text-sm text-gray-700">Prize: {prize}</p>
        <Link href={url} passHref legacyBehavior>
          <a className="text-primary-500 hover:text-primary-700">Learn more</a>
        </Link>
      </div>
    </div>
  );
};

export default Card;
