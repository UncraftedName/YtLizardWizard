import { Link } from "#/components/ui";
import { Playlist } from "#/types/DataTypes";

type Props = {
  playlists: Playlist[];
};
export default function PlaylistTable({ playlists }: Props) {
  return (
    <table className="w-full table-auto border-[3px] border-gray-700 text-center">
      <thead className="border border-gray-700">
        <tr>
          <th>Order</th>
          <th>Name</th>
          <th>Owner</th>
          <th>Num Videos</th>
          <th>Rename Rules</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {playlists.map((playlist, index) => {
          return (
            <tr key={playlist.id}>
              <td>{index + 1}</td>
              <td>
                {playlist.url ? (
                  <Link href={playlist.url}>{playlist.name}</Link>
                ) : (
                  playlist.name
                )}
              </td>
              <td className="italic">
                id: {playlist.ownerChannelId.toString()}
              </td>
              <td>{playlist.numVideos.toString()}</td>
              <td className="italic">
                id: {playlist.renameRulesId.toString()}
              </td>
              <td>{playlist.status}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
