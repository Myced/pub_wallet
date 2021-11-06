import React, { useState } from 'react';

function NewTransfer({createTransfer}){

	const [transfer, setTransfer] = useState(undefined);

	const updateTransfer = (e, field) => {
		const value = e.target.value;
		setTransfer({...transfer, [field]: value});
	}

	const submit = e => {
		e.preventDefault();
		createTransfer(transfer);
	}

	return (
		<div>
			<form onSubmit = { e => submit(e)}>
				<label for="amount" >Amount: </label>
				<input type="text" id="amount" onChange={e => updateTransfer(e, 'amount')} />

				<label for="to">To: </label>
				<input type="text" id="to" onChange={e => updateTransfer(e, 'to')} />

				<button onClick={e => submit(e)}>Submit</button>
			</form>
		</div>
	)
}

export default NewTransfer;