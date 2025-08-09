interface ProjectCardProps {
  title: string;
  description: string;
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
    <div className="relative flex w-full max-w-[26rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-lg">
      <div className="relative mx-4 mt-4 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40">
        {imageBase64 ? (
          <img
            src={`data:image/png;base64,${imageBase64}`}
            alt={title}
            className="w-full h-48 object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-48 bg-blue-gray-600 rounded-xl flex items-center justify-center text-white">
            No Image
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h5 className="font-sans text-xl font-medium leading-snug tracking-normal text-blue-gray-900 antialiased mb-3">
          {title}
        </h5>
        <p className="font-sans text-base font-light leading-relaxed text-gray-700 antialiased flex-grow">
          {description}
        </p>

        <div className="mt-6 flex gap-3">
          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block select-none rounded-md bg-gray-900 px-4 py-2 text-center align-middle font-sans text-sm font-semibold uppercase text-white shadow-md shadow-gray-900/20 transition-colors duration-200 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 active:opacity-90"
              data-ripple-light="true"
            >
              Live Demo
            </a>
          )}
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block select-none rounded-md bg-gray-800 px-4 py-2 text-center align-middle font-sans text-sm font-semibold uppercase text-white shadow-md shadow-gray-800/20 transition-colors duration-200 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 active:opacity-90"
              data-ripple-light="true"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
