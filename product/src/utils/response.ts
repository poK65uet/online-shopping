const formateData = (data: any) => {
	if (data) {
		return { data };
	} else {
		throw new Error("Data not found");
	}
};

export { formateData };
