import { Link } from "#/components/ui";
import { Channel } from "#/types/DataTypes";

type Props = {
  channels: Channel[];
};
export default function ChannelsTable({ channels }: Props) {
  return (
    <table className="w-full table-auto border-[3px] border-gray-700 text-center">
      <thead className="border border-gray-700">
        <tr>
          <th>Order</th>
          <th>Name</th>
          <th>Num Videos</th>
          <th>Rename Rules</th>
        </tr>
      </thead>
      <tbody>
        {channels.map((channel, index) => {
          return (
            <tr key={channel.id}>
              <td>{index + 1}</td>
              <td>
                {channel.url ? (
                  <Link href={channel.url}>{channel.name}</Link>
                ) : (
                  channel.name
                )}
              </td>
              <td>{channel.numVideos.toString()}</td>
              <td className="italic">id: {channel.renameRulesId.toString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
