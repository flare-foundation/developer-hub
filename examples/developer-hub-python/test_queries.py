import pytest


@pytest.mark.asyncio()
async def test_chain_id_coston2() -> None:
    from chain_id_coston2 import main

    COSTON2_CHAIN_ID = 114

    chain_id = await main()
    assert chain_id == COSTON2_CHAIN_ID


@pytest.mark.asyncio()
async def test_chain_id_flare() -> None:
    from chain_id_flare import main

    FLARE_CHAIN_ID = 14

    chain_id = await main()
    assert chain_id == FLARE_CHAIN_ID


@pytest.mark.asyncio()
async def test_fetch_abi_coston2() -> None:
    from fetch_abi_coston2 import main

    abi = await main()
    assert abi[4]["name"] == "getContractAddressByName"


@pytest.mark.asyncio()
async def test_fetch_abi_flare() -> None:
    from fetch_abi_flare import main

    abi = await main()
    assert abi[4]["name"] == "getContractAddressByName"


@pytest.mark.asyncio()
async def test_ftsov2_consumer_coston2() -> None:
    from ftsov2_consumer_coston2 import main

    TIMESTAMP = 1717860157

    feeds, decimals, timestamp = await main()

    assert len(feeds) == len(decimals)
    assert timestamp > TIMESTAMP


@pytest.mark.asyncio()
async def test_make_query_coston2() -> None:
    from make_query_coston2 import main

    wnat_addr = await main()
    assert wnat_addr == "0xC67DCE33D7A8efA5FfEB961899C73fe01bCe9273"


@pytest.mark.asyncio()
async def test_make_query_flare() -> None:
    from make_query_flare import main

    wnat_addr = await main()
    assert wnat_addr == "0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d"


@pytest.mark.asyncio()
async def test_ftsov2_config_coston2() -> None:
    from ftsov2_config_coston2 import main

    FEED_CONFIGURATIONS = [
        (
            b"\x01FLR/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (
            b"\x01SGB/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (
            b"\x01BTC/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (
            b"\x01XRP/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (
            b"\x01LTC/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (
            b"\x01XLM/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (b"\x01DOGE/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00", 5000, 10000),
        (
            b"\x01ADA/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (b"\x01ALGO/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00", 5000, 10000),
        (
            b"\x01ETH/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (
            b"\x01FIL/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (
            b"\x01ARB/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (b"\x01AVAX/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00", 5000, 10000),
        (
            b"\x01BNB/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (b"\x01MATIC/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00", 5000, 10000),
        (
            b"\x01SOL/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
        (b"\x01USDC/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00", 5000, 10000),
        (b"\x01USDT/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00", 5000, 10000),
        (
            b"\x01XDC/USD\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00",
            5000,
            10000,
        ),
    ]

    feed_configurations = await main()
    assert feed_configurations == FEED_CONFIGURATIONS


@pytest.mark.asyncio()
async def test_secure_random_coston2() -> None:
    from secure_random_coston2 import main

    RESPONSE = [
        65327326390574810728408859800051811709100936196596102009169565666307397771803,
        True,
        1723781790,
    ]

    response = await main()
    assert len(response) == len(RESPONSE)
