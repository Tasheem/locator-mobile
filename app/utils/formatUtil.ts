const formatPhoneNumber = (pn: string) => {
	if(!pn) {
		return '';
	}

	const phoneNumber = pn.slice(2);
	const split = [phoneNumber.slice(0, 3), phoneNumber.slice(3, 6), phoneNumber.slice(6, 10)];
	const formattedNumber = `(${split[0]})-${split[1]}-${split[2]}`;

	return formattedNumber;
}

export { formatPhoneNumber };