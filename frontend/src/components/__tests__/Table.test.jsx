import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableEmptyState,
} from '../common/Table';

describe('Table Primitives', () => {
  it('renders table headers with accessible scope="col"', () => {
    render(
      <Table>
        <TableHeader>
          <tr>
            <TableHead>Candidate</TableHead>
            <TableHead>Stage</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Jane Doe</TableCell>
            <TableCell>Screening</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const headers = screen.getAllByRole('columnheader');
    expect(headers.length).toBe(2);
    expect(headers[0]).toHaveAttribute('scope', 'col');
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });

  it('renders empty state when no records exist', () => {
    render(
      <Table>
        <TableBody>
          <TableEmptyState
            title="No Candidates Found"
            description="Adjust your filters to see results."
            colSpan={3}
          />
        </TableBody>
      </Table>
    );

    expect(screen.getByText('No Candidates Found')).toBeInTheDocument();
    expect(screen.getByText('Adjust your filters to see results.')).toBeInTheDocument();
  });
});
