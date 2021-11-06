import React from 'react';

function TransferList({transfers, approveTransfer}){
	console.log(transfers);
	return (
		<div>
			<h3>Transfers</h3>

			<table>
				<thead>
					<th>Id</th>
					<th>Amount</th>
					<th>To</th>
					<th>Approvals</th>
					<th>Sent</th>
				</thead>
				<tbody>
					{
						transfers.map( transfer => (
							<tr key={transfer.id}>
								<td>{transfer.id}</td>
								<td>{transfer.amount}</td>
								<td>{transfer.to}</td>
								<td>
									{transfer.approvals}
									<button onClick={ () => approveTransfer(transfer.id)}> Approve</button>
								</td>
								<td>{ transfer.sent ? "yes": "no" }</td>
							</tr>
						 ) )
					}
				</tbody>
			</table>
		</div>
	)
}

export default TransferList;