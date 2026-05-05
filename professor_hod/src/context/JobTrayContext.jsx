// src/context/JobTrayContext.jsx
import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useEffect,
	useMemo,
} from "react";
import { jobTrayService } from "../api/services/jobTray.service";

const JobTrayContext = createContext();

export const JobTrayProvider = ({ children }) => {
	const [rawJobs, setRawJobs] = useState([]);
	const [readJobIds, setReadJobIds] = useState(() => {
		const saved = localStorage.getItem("readJobIds");
		return saved ? JSON.parse(saved) : [];
	});
	const [isLoading, setIsLoading] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);
	const isFetching = useRef(false);

	useEffect(() => {
		localStorage.setItem("readJobIds", JSON.stringify(readJobIds));
	}, [readJobIds]);

	/**
	 * Memoized boolean for global UI indicators (like the Header dot).
	 * Recalculates only when raw data or read status changes.
	 */
	const hasUnreadJobs = useMemo(() => {
		return rawJobs.some((job) => !readJobIds.includes(job.id));
	}, [rawJobs, readJobIds]);

	/**
	 * Maps raw job data to include the isRead flag for UI rendering
	 */
	const jobs = useMemo(() => {
		return rawJobs.map((job) => ({
			...job,
			isRead: readJobIds.includes(job.id),
		}));
	}, [rawJobs, readJobIds]);

	const refreshJobs = async () => {
		if (isFetching.current) return;
		if (!hasFetched) setIsLoading(true);

		isFetching.current = true;
		try {
			const response = await jobTrayService.getPendingJobs();
			// Direct handling of the API response structure
			setRawJobs(response.success ? response.data : []);
			setHasFetched(true);
		} catch (error) {
			console.error("Error fetching jobs from server:", error);
			setRawJobs([]);
		} finally {
			setIsLoading(false);
			isFetching.current = false;
		}
	};

	const markJobAsRead = (jobId) => {
		if (!readJobIds.includes(jobId)) {
			setReadJobIds((prev) => [...prev, jobId]);
		}
	};

	return (
		<JobTrayContext.Provider
			value={{
				jobs,
				isLoading,
				refreshJobs,
				hasFetched,
				hasUnreadJobs,
				markJobAsRead,
			}}
		>
			{children}
		</JobTrayContext.Provider>
	);
};

export const useJobs = () => useContext(JobTrayContext);
