import React from "react";

export interface TableColumn {
  header: string;
  accessor: string;
  render?: (item: any) => JSX.Element;
}

interface TableProps {
  data: any[];
  columns: TableColumn[];
  className?: string;
}

export default function Table({ data, columns, className }: TableProps) {
  return (
    <div className={`bg-my-color8 ${className}`}>
      <table className="mt-1 w-full whitespace-nowrap text-left">
        <thead className="border-b border-white/10 text-sm leading-6 text-white">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="py-1 pl-4 pr-4 font-semibold sm:pl-6 lg:pl-8"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {data.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="py-4 pl-4 pr-4 sm:pl-6 lg:pl-8 text-sm leading-6"
                >
                  {column.render ? column.render(item) : item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
