import { useWeb3Contract } from "react-moralis";
import { contractAddress, abi } from "../constants/index";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function EntranceFee() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const dispatch = useNotification();
  const chainId = parseInt(chainIdHex);

  const raffleAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null;

  const [entranceFee, setEntranceFee] = useState("0");
  const [numPlayers, setNumPlayers] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const { runContractFunction: enterRaffle } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify chainId
    functionName: "enterRaffle",
    msgValue: entranceFee,
  });

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify chainId
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify chainId
    functionName: "getNumOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress, // specify chainId
    functionName: "getRecentWinner",
    params: {},
  });

  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNotification(tx);
    updateUI();
  };

  const handleNotification = function () {
    dispatch({
      type: "success",
      message: "Transcation complete!",
      title: "Transcation Notification",
      position: "topR",
      icon: "checkmark",
    });
  };

  const handleError = function () {
    dispatch({
      type: "error",
      message: "Transcation Failed",
      title: "Trancation Notification",
      position: "topR",
    });
  };

  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const winnerFromCall = (await getRecentWinner()).toString();
    const playersFromCall = (await getNumOfPlayers()).toString();
    setEntranceFee(entranceFeeFromCall);
    setRecentWinner(winnerFromCall);
    setNumPlayers(playersFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      {raffleAddress ? (
        <div>
          <button
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: handleError,
              });
            }}
          >
            Enter Raffle
          </button>
          <div>
            Enterance Fee:{ethers.utils.formatUnits(entranceFee, "ether")}ETH
          </div>
          <div>Number of players:{numPlayers}</div>
          <div>Recent winner:{recentWinner}</div>
        </div>
      ) : (
        <div>no wallet detected</div>
      )}
    </div>
  );
}
