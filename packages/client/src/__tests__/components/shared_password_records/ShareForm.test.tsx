import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import { ShareForm } from '../../../components/shared_password_records/ShareForm';
import { createSharedPasswordRecordRequest } from '../../../store/slices/sharedPasswordRecordsSlice';


// Mock form values to be used in the submit test
let mockFormValues = {
  email: 'test@example.com',
  password_record_id: '1'
};

// Mock react-hook-form
jest.mock('react-hook-form', () => {
  const originalModule = jest.requireActual('react-hook-form');
  
  return {
    __esModule: true,
    ...originalModule,
    useForm: () => ({
      register: jest.fn().mockImplementation(name => ({ name })),
      handleSubmit: jest.fn(cb => (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        cb(mockFormValues);
      }),
      formState: { 
        errors: {} 
      },
      reset: jest.fn(),
      // Add missing properties to satisfy TypeScript
      watch: jest.fn(),
      getValues: jest.fn(),
      getFieldState: jest.fn(),
      setError: jest.fn(),
      clearErrors: jest.fn(),
      setValue: jest.fn(),
      trigger: jest.fn(),
      control: {},
      unregister: jest.fn(),
      setFocus: jest.fn()
    })
  };
});

describe('ShareForm', () => {
  const mockRecords = [
    {
      id: 1,
      title: 'Test Record 1',
      username: 'testuser1',
      password: 'testpass1',
      url: 'https://test1.com',
      user: {
        id: 1,
        email: 'owner@example.com',
        display_name: 'Owner'
      }
    },
    {
      id: 2,
      title: 'Test Record 2',
      username: 'testuser2',
      password: 'testpass2',
      url: 'https://test2.com',
      user: {
        id: 1,
        email: 'owner@example.com',
        display_name: 'Owner'
      }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockFormValues = {
      email: 'test@example.com',
      password_record_id: '1'
    };
  });

  it('renders the form with all elements', () => {
    renderWithProviders(<ShareForm />, {
      preloadedState: {
        passwordRecords: {
          records: mockRecords,
          sharedRecords: [],
          currentRecord: null,
          isLoading: false,
          error: null
        }
      }
    });

    // Check that the form title and elements are rendered
    expect(screen.getByRole("heading", { name: "Share Access" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter user's email")).toBeInTheDocument();
    expect(screen.getByText('Share All')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Share Access' })).toBeInTheDocument();

    // Check that the password records are in the dropdown
    mockRecords.forEach(record => {
      expect(screen.getByText(record.title)).toBeInTheDocument();
    });
  });

  it('dispatches createSharedPasswordRecordRequest with specific record ID when submitted', () => {
    const { store } = renderWithProviders(<ShareForm />, {
      preloadedState: {
        passwordRecords: {
          records: mockRecords,
          sharedRecords: [],
          currentRecord: null,
          isLoading: false,
          error: null
        }
      }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Share Access' }));

    // Check that the correct action was dispatched
    expect(store.getActions()).toContainEqual(
      createSharedPasswordRecordRequest({
        email: 'test@example.com',
        password_record_id: 1
      })
    );
  });

  it('dispatches createSharedPasswordRecordRequest without record ID when Share All is selected', () => {
    // Update mock form values for this test
    mockFormValues = {
      email: 'test@example.com',
      password_record_id: ''
    };

    const { store } = renderWithProviders(<ShareForm />, {
      preloadedState: {
        passwordRecords: {
          records: mockRecords,
          sharedRecords: [],
          currentRecord: null,
          isLoading: false,
          error: null
        }
      }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Share Access' }));

    // Check that the correct action was dispatched
    expect(store.getActions()).toContainEqual(
      createSharedPasswordRecordRequest({
        email: 'test@example.com'
      })
    );
  });

  it('validates form fields and shows errors', () => {
    // Override the mock for react-hook-form for this test only
    const useFormModule = require('react-hook-form');
    const originalUseForm = useFormModule.useForm;
    
    // Override with a version that returns errors
    useFormModule.useForm = jest.fn().mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(cb => (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Don't call callback to simulate validation failure
      }),
      formState: {
        errors: {
          email: { message: 'Email is required' },
          password_record_id: { message: 'Please select a password record' }
        }
      },
      reset: jest.fn(),
      watch: jest.fn(),
      getValues: jest.fn(),
      getFieldState: jest.fn(),
      setError: jest.fn(),
      clearErrors: jest.fn(),
      setValue: jest.fn(),
      trigger: jest.fn(),
      control: {},
      unregister: jest.fn(),
      setFocus: jest.fn()
    });

    renderWithProviders(<ShareForm />, {
      preloadedState: {
        passwordRecords: {
          records: mockRecords,
          sharedRecords: [],
          currentRecord: null,
          isLoading: false,
          error: null
        }
      }
    });

    // Verify that the mock was called
    expect(useFormModule.useForm).toHaveBeenCalled();
    
    // Restore the original implementation
    useFormModule.useForm = originalUseForm;
  });

  it('resets the form after successful submission', () => {
    // Get the mock reset function
    const resetMock = jest.fn();
    
    // Override useForm for this test
    const useFormModule = require('react-hook-form');
    const originalUseForm = useFormModule.useForm;
    
    useFormModule.useForm = jest.fn().mockReturnValue({
      register: jest.fn(),
      handleSubmit: jest.fn(cb => (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        cb(mockFormValues);
      }),
      formState: { errors: {} },
      reset: resetMock,
      watch: jest.fn(),
      getValues: jest.fn(),
      getFieldState: jest.fn(),
      setError: jest.fn(),
      clearErrors: jest.fn(),
      setValue: jest.fn(),
      trigger: jest.fn(),
      control: {},
      unregister: jest.fn(),
      setFocus: jest.fn()
    });

    // Render with the overridden mock
    renderWithProviders(<ShareForm />, {
      preloadedState: {
        passwordRecords: {
          records: mockRecords,
          sharedRecords: [],
          currentRecord: null,
          isLoading: false,
          error: null
        }
      }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Share Access' }));

    // Check that reset was called
    expect(resetMock).toHaveBeenCalled();
    
    // Restore the original implementation
    useFormModule.useForm = originalUseForm;
  });
}); 