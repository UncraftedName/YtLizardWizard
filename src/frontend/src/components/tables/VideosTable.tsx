import { Link } from "#/components/ui";
import { Video } from "#/types/DataTypes";

type Props = {
  videos: Video[];
};
export default function VideosTable({ videos }: Props) {
  return (
    <table className="w-full table-auto border-[3px] border-gray-700 text-center">
      <thead className="border border-gray-700">
        <tr>
          <th>Order</th>
          <th>Name</th>
          <th>Length (ms)</th>
          <th>Rename Rules</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {videos.map((video, index) => {
          return (
            <tr key={video.id}>
              <td>{index + 1}</td>
              <td>
                {video.url ? (
                  <Link href={video.url}>{video.name}</Link>
                ) : (
                  video.name
                )}
              </td>
              <td>{video.lenMs.toString()}</td>
              <td className="italic">id: {video.renameRulesId.toString()}</td>
              <td>{video.status}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
