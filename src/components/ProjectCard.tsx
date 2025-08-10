interface ProjectCardProps {
  title: string;
  description?: string;
  imageBase64?: string;
  liveLink?: string;
  githubLink?: string;
}

const ProjectCard = ({
  title,
  description,
  imageBase64,
  liveLink,
  githubLink,
}: ProjectCardProps) => {
  return (
    <div className="flex w-full max-w-[22rem] flex-col rounded-2xl bg-white shadow-md border border-gray-300 p-4">
      {/* Image */}
      <div className="overflow-hidden rounded-xl">
        {imageBase64 ? (
          <img
            src={`data:image/png;base64,${imageBase64}`}
            alt={title}
            className="w-full h-48 object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-48 bg-gray-300 rounded-xl flex items-center justify-center text-gray-600">
            No Image
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className="mt-4 text-center font-bold text-xl text-black">
        {title}
      </h2>
      <p className=" text-xs font-light leading-relaxed text-gray-700 antialiased flex-grow">
          {description}
        </p>


      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-6">
        {githubLink && (
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-gray-700 px-8 py-2 text-center text-sm font-semibold text-black hover:bg-gray-800 transition-colors hover:text-white"
          >
            Github
          </a>
        )}
        {liveLink && (
          <a
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-gray-700 px-8 py-2 text-center text-sm font-semibold text-black hover:bg-gray-800 transition-colors hover:text-white"
          >
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
