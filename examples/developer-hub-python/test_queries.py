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
