use anchor_lang::prelude::*;

declare_id!("6erxegH47t73aQjWm3fZEkwva57tz2JH7ZMxdoayzxVQ");

#[program]
pub mod cascade {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
