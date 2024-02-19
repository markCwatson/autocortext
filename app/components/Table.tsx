import React from 'react';

export interface TableColumn {
  header: string;
  accessor: string;
  render?: (item: any) => JSX.Element;
}

interface TableProps {
  data: any[];
  columns: TableColumn[];
  className?: string;
  onSelect?: (selection: any) => void;
}

export default function Table({
  data,
  columns,
  className,
  onSelect,
}: TableProps) {
  return (
    <div className={`bg-inherit ${className}`}>
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
                  className="py-4 pl-4 pr-4 sm:pl-6 lg:pl-8 text-sm leading-6 hover:bg-my-color6 cursor-pointer transition-colors duration-200"
                  onClick={() => onSelect && onSelect(item)}
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
