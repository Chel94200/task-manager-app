import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addTaskApi } from '../stores/tasksSlice';
import { toast } from 'react-toastify';

const AddTask = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user); // get logged-in user

    const schema = Yup.object().shape({
        text: Yup.string()
            .trim()
            .required('Task cannot be empty')
            .min(3, 'Task must be at least 3 characters')
            .max(100, 'Task cannot exceed 100 characters')
            .matches(
                /^[a-zA-Z\s.,!?'"-]+$/,
                'Task can only contain letters and punctuation'
            ),
    });

    return (
        <Formik
            initialValues={{ text: '' }}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => {
                if (!user) {
                    toast.error('You must be logged in to add tasks!');
                    return;
                }

                dispatch(addTaskApi({ text: values.text, ownerId: user.id })).unwrap().then(()=> resetForm()).catch(()=>{});
            }}
        >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <input
                            type="text"
                            name="text"
                            value={values.text}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Add task..."
                            style={{ flex: 1, marginBottom: '15px'}}
                        />
                        <button type="submit" className='add-btn'>Add</button>
                    </div>

                    {errors.text && touched.text && (
                        <div
                            style={{
                                color: '#721c24',
                                backgroundColor: '#f8d7da',
                                border: '1px solid #f5c6cb',
                                borderRadius: '5px',
                                padding: '10px',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            {errors.text}
                        </div>
                    )}
                </form>
            )}
        </Formik>
    );
};

export default AddTask;
