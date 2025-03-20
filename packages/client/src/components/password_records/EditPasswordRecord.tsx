import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { fetchRecordRequest, updateRecordRequest } from "../../store/slices/passwordRecordsSlice";
import { Link } from "react-router-dom";
import { PasswordRecordFormData } from "../../../types";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditPasswordRecord : React.FC = () => {
    const { id } = useParams();
	 if (!id) return <div>No id found</div>;
    const navigate = useNavigate();
	 const dispatch = useDispatch<AppDispatch>();
	 const currentRecord = useSelector((state: RootState) => state.passwordRecords.currentRecord);
	 const { error } = useSelector((state: RootState) => state.passwordRecords);
	 const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordRecordFormData>();

	 useEffect(() => {
		if (id) dispatch(fetchRecordRequest(parseInt(id)));
	 }, [dispatch, id]);	

	 useEffect(() => {
		if (currentRecord) {
			reset(currentRecord);
		}
	 }, [currentRecord, reset]);

	 const onSubmit = (data: PasswordRecordFormData) => {
		const updatedRecordData = {
			...data,
			id: parseInt(id)
		}
		dispatch(updateRecordRequest(updatedRecordData));
		if (error) {
			toast.error(error);
		} else {
			toast.success('Password record updated successfully');
			navigate(`/passwords`);
		}
	 }

	 return (
		<div className="md:w-2/3 w-full">
		  <h1 className="font-bold text-4xl mb-6">Editing password record</h1>
		  
		  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
			 <div>
				<label className="block text-sm font-medium text-gray-700">Title</label>
				<input
				  {...register('title', { required: 'Title is required' })}
				  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				/>
				{errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
			 </div>
  
			 <div>
				<label className="block text-sm font-medium text-gray-700">Username</label>
				<input
				  {...register('username', { required: 'Username is required' })}
				  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				/>
				{errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
			 </div>
  
			 <div>
				<label className="block text-sm font-medium text-gray-700">Password</label>
				<input
				  type="password"
				  {...register('password', { required: 'Password is required' })}
				  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				/>
				{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
			 </div>
  
			 <div>
				<label className="block text-sm font-medium text-gray-700">URL</label>
				<input
				  {...register('url', { required: 'URL is required' })}
				  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
				/>
				{errors.url && <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>}
			 </div>
  
			 <div className="flex space-x-2 mt-4">
				<button
				  type="submit"
				  className="rounded-md px-3.5 py-2.5 bg-indigo-600 text-white hover:bg-indigo-500 font-medium"
				>
				  Update Password Record
				</button>
				
				<Link
				  to={`/passwords/${id}`}
				  className="rounded-md px-3.5 py-2.5 bg-gray-100 hover:bg-gray-50 inline-block font-medium"
				>
				  Show this password record
				</Link>
				
				<Link
				  to="/passwords"
				  className="rounded-md px-3.5 py-2.5 bg-gray-100 hover:bg-gray-50 inline-block font-medium"
				>
				  Back to password records
				</Link>
			 </div>
		  </form>
		</div>
	 );
}

export default EditPasswordRecord