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
              <td>{channel.name}</td>
              <td>{channel.numVideos}</td>
              <td>{channel.renameRulesId}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
